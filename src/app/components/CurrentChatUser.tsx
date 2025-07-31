'use client'
type CurrentChatUserProps = {
    iconPath?: string
    userName?: string
}

export function CurrentChatUser({
    iconPath = '/globe.svg',
    userName = 'User Name',
}: CurrentChatUserProps) {
    return (
        <div className="current_user">
            <div className="icon">
                <img src={iconPath} alt="User Icon" />
            </div>
            <div className="name">{userName}</div>
        </div>
    )
}
