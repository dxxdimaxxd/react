'use client'
export function DebugToggle() {
    const toggleDebug = () => {
        document.body.classList.toggle('debug')
    }

    return <button onClick={toggleDebug}>Переключить бордеры</button>
}
