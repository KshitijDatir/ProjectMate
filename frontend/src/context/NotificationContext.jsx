import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { io } from "socket.io-client"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth()
  const API_BASE = import.meta.env.VITE_API_BASE_URL

  const [notifications, setNotifications] = useState([])

  /* --------------------------------------------------
     🔹 Derived unread count (NO manual decrement)
  -------------------------------------------------- */
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length
  }, [notifications])

  /* --------------------------------------------------
     🔹 Fetch notifications on login
  -------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      setNotifications([])
      return
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        setNotifications(data.notifications)
      } catch (err) {
        console.error("Notification fetch error:", err.message)
      }
    }

    fetchNotifications()
  }, [token, API_BASE])

  /* --------------------------------------------------
     🔹 Socket connection (real-time sync)
  -------------------------------------------------- */
  useEffect(() => {
    if (!token) return

    const socket = io("http://localhost:5000", {
      auth: { token },
    })

    socket.on("notification", (notification) => {
      // Prevent accidental duplicates
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === notification._id)
        if (exists) return prev
        return [notification, ...prev]
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  /* --------------------------------------------------
     🔹 Mark single notification as read
  -------------------------------------------------- */
  const markAsRead = async (id) => {
    const target = notifications.find((n) => n._id === id)

    // 🔒 Guard against double-click / race
    if (!target || target.isRead) return

    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      )
    } catch (err) {
      console.error("Mark as read error:", err.message)
    }
  }

  /* --------------------------------------------------
     🔹 Mark all notifications as read
  -------------------------------------------------- */
  const markAllAsRead = async () => {
    if (unreadCount === 0) return

    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      )
    } catch (err) {
      console.error("Mark all error:", err.message)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  return useContext(NotificationContext)
} 