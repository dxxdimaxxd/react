'use client';
import Image from 'next/image';
import { DebugToggle } from './components/DebugToggle';
import { CurrentChatUser } from './components/CurrentChatUser';
import { UserCard } from './components/UserCard';
import React, { useRef, useEffect } from 'react';
import { Message } from './components/Message';
import { AnyARecord } from 'dns';
export default function Home() {
  const wsForLeftPanel = useRef<WebSocket | null>(null);
  const wsForCurrentChat = useRef<WebSocket | null>(null);
  const [leftPanelData, setLeftPanelData] = React.useState<any>('');
  const [currentChatData, setCurrentChatData] = React.useState<any>('');

  // получить пользователей с сервера
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('https://your-server.com/api/users');
        if (!res.ok) throw new Error('Ошибка запроса');
        const data = await res.json();
        setUserlist(data);
      } catch (e) {
        console.error('Ошибка при запросе пользователей:', e);
      }
    }
    fetchUsers();
  }, []);

  // вебсокеты для левой панели и текущего чата
  useEffect(() => {
    wsForLeftPanel.current = new WebSocket('wss://example.com/ws');
    wsForCurrentChat.current = new WebSocket('wss://example.com/ws');

    wsForLeftPanel.current.onopen = () => {
      console.log('WebSocket открыт');
    };

    wsForLeftPanel.current.onmessage = (event) => {
      setLeftPanelData(event.data);
      console.log('WebSocket сообщение:', event.data);
    };

    wsForLeftPanel.current.onclose = () => {
      console.log('WebSocket закрыт');
    };

    wsForLeftPanel.current.onerror = (err) => {
      console.log('WebSocket ошибка:', err);
    };

    wsForCurrentChat.current.onopen = () => {
      console.log('WebSocket для текущего чата открыт');
    };

    wsForCurrentChat.current.onmessage = (event) => {
      setCurrentChatData(event.data);
      console.log('WebSocket для текущего чата сообщение:', event.data);
    };

    wsForCurrentChat.current.onclose = () => {
      console.log('WebSocket для текущего чата закрыт');
    };

    wsForCurrentChat.current.onerror = (err) => {
      console.log('WebSocket для текущего чата ошибка:', err);
    };

    return () => {
      wsForLeftPanel.current?.close();
      wsForCurrentChat.current?.close();
    };
  }, []);

  type User = {
    phone: string;
    name: string;
    iconPath: string;
    lastMessage: string;
    lastMessageTime: string;
    selected?: boolean;
    messages: {
      text: string;
      time: string;
      senderName: string;
      isResended: boolean;
      isAnswered: boolean;
      userMessage: boolean;
    }[];
  };
  const [searchWord, setSearchWord] = React.useState('');
  const [userlist, setUserlist] = React.useState<User[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  React.useEffect(() => {
    const boolCombos = [
      { isResended: false, isAnswered: false, userMessage: false },
      { isResended: false, isAnswered: false, userMessage: true },
      { isResended: false, isAnswered: true, userMessage: false },
      { isResended: false, isAnswered: true, userMessage: true },
      { isResended: true, isAnswered: false, userMessage: false },
      { isResended: true, isAnswered: false, userMessage: true },
      { isResended: false, isAnswered: false, userMessage: false },
      { isResended: false, isAnswered: false, userMessage: true },
      { isResended: false, isAnswered: true, userMessage: false },
      { isResended: false, isAnswered: true, userMessage: true },
      { isResended: true, isAnswered: false, userMessage: false },
      { isResended: true, isAnswered: false, userMessage: true },
    ];

    const makeMessages = (userName: string) =>
      boolCombos.map((combo, idx) => ({
        text: `Сообщение ${idx + 1} (${Object.entries(combo)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')})`,
        time: ` 10:${idx < 10 ? '0' : ''}${idx}`,
        senderName: combo.userMessage ? userName : 'User Name',
        ...combo,
      }));

    const getLastMessage = (messages: any[]) => {
      if (!messages || messages.length === 0) return '';
      return messages[messages.length - 1].text;
    };

    const users = [
      {
        phone: '+380996812233',
        name: 'User 1',
        iconPath: '/globe.svg',
        selected: true,
      },
      {
        phone: '+380996812234',
        name: 'User 2',
        iconPath: '/globe.svg',
        selected: false,
      },
      {
        phone: '+380996812235',
        name: 'User 3',
        iconPath: '/globe.svg',
        selected: false,
      },
      {
        phone: '+380996812236',
        name: 'User 4',
        iconPath: '/globe.svg',
        selected: false,
      },
      {
        phone: '+380996812237',
        name: 'User 5',
        iconPath: '/globe.svg',
        selected: false,
      },
      {
        phone: '+380996812238',
        name: 'User 6',
        iconPath: '/globe.svg',
        selected: false,
      },
      {
        phone: '+380996812239',
        name: 'User 7',
        iconPath: '/globe.svg',
        selected: false,
      },
      {
        phone: '+380996812240',
        name: 'User 8',
        iconPath: '/globe.svg',
        selected: false,
      },
      {
        phone: '+380996812241',
        name: 'User 9',
        iconPath: '/globe.svg',
        selected: false,
      },
    ].map((user, idx) => {
      const messages = makeMessages(user.name);
      return {
        ...user,
        lastMessage: getLastMessage(messages),
        lastMessageTime:
          messages.length > 0 ? messages[messages.length - 1].time : '',
        messages,
      };
    });

    setUserlist(users);
  }, []);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [userlist]);

  function ChangeUser(index: number): void {
    setUserlist((prev) =>
      prev.map((user, i) =>
        user.selected
          ? { ...user, selected: false }
          : i === index
            ? { ...user, selected: !user.selected }
            : user
      )
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="search">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <span className="search-icon">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
            </svg>
          </span>
        </div>
        <CurrentChatUser iconPath="/globe.svg" userName="User Name" />
      </div>
      <div className="content">
        <div className="user-list">
          {userlist
            .filter((user) =>
              user.name.toLowerCase().includes(searchWord.toLowerCase())
            )
            .map((user, index) => (
              <UserCard
                key={index}
                user={user}
                onClick={() => ChangeUser(index)}
              />
            ))}
        </div>
        <div className="chat-window">
          <div className="chat" ref={chatRef}>
            {userlist.map((user, index) =>
              user.selected
                ? user.messages.map((message, msgIndex) => (
                    <Message
                      key={msgIndex}
                      message={message}
                      name={'User Name'}
                      iconPath={'/globe.svg'}
                    />
                  ))
                : null
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="smile-icon">
              <Image src="/smile.svg" alt="Smile Icon" width={24} height={24} />
            </div>
            <div className="smile-icon">
              <Image
                src="/attachment.svg"
                alt="Attach Icon"
                width={24}
                height={24}
              />
            </div>
            <button
              onClick={() => {
                setNewMessage('');
                if (newMessage.trim() === '') return;
                setUserlist((prev) =>
                  prev.map((user) =>
                    user.selected
                      ? {
                          ...user,
                          messages: [
                            ...user.messages,
                            {
                              text: newMessage,
                              time: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              }),
                              senderName: 'User Name',
                              isResended: false,
                              isAnswered: false,
                              userMessage: false,
                            },
                          ],
                        }
                      : user
                  )
                );
              }}
              type="submit"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
