'use client'
import * as React from 'react'

type User = {
    phone: string
    name: string
    iconPath: string
    lastMessage: string
    lastMessageTime: string
    selected?: boolean
    messages: {
        text: string
        time: string
        isResended: boolean
        isAnswered: boolean
        userMessage: boolean
    }[]
}

type UserCardProps = {
    user: User
    onClick?: () => void
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => (
    <div
        className={`user-card ${user.selected ? 'selected' : ''}`}
        onClick={onClick}
    >
        <img
            className="user-icon"
            src={user.iconPath}
            alt={user.name}
            width={32}
            height={32}
        />
        <div className="user-info">
            <div className="user-phone">{user.phone}</div>
            <div className="user-name">{user.name}</div>
            <div className="user-last-message">{user.lastMessage}</div>
        </div>
        <div className="user-last-message-time">{user.lastMessageTime}</div>
    </div>
)
