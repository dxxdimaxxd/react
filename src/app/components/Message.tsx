'use client'
import React from 'react'
import Image from 'next/image'

type MessageProps = {
    name: string
    iconPath?: string
    message: {
        text: string
        time: string
        senderName: string
        isResended: boolean
        isAnswered: boolean
        userMessage: boolean
    }
}

export const Message: React.FC<MessageProps> = ({
    message,
    name,
    iconPath,
}) => {
    const avatarSrc = !message.userMessage
        ? iconPath || '/user-avatar.svg'
        : '/globe.svg'

    const alignmentClass = !message.userMessage ? 'message-right' : ''

    return (
        <div
            className={`message${!message.userMessage ? ' user-message' : ''} ${alignmentClass}`}
        >
            <img
                src={avatarSrc}
                alt="avatar"
                className="message-avatar"
                width={32}
                height={32}
            />
            <div className="message-content">
                <span className="message-sender">{message.senderName}</span>
                <span className="message-body">{message.text}</span>
                <span className="message-time">{message.time}</span>
            </div>
        </div>
    )
}
