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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

    // // получить пользователей с сервера
    // useEffect(() => {
    //   async function fetchUsers() {
    //     try {
    //       const res = await fetch('https://your-server.com/api/users');
    //       if (!res.ok) throw new Error('Ошибка запроса');
    //       const data = await res.json();
    //       setUserlist(data);
    //     } catch (e) {
    //       console.error('Ошибка при запросе пользователей:', e);
    //     }
    //   }
    //   fetchUsers();
    // }, []);

    // // вебсокеты для левой панели и текущего чата
    // useEffect(() => {
    //   wsForLeftPanel.current = new WebSocket('wss://example.com/ws');
    //   wsForCurrentChat.current = new WebSocket('wss://example.com/ws');

    //   wsForLeftPanel.current.onopen = () => {
    //     console.log('WebSocket открыт');
    //   };

    //   wsForLeftPanel.current.onmessage = (event) => {
    //     setLeftPanelData(event.data);
    //     console.log('WebSocket сообщение:', event.data);
    //   };

    //   wsForLeftPanel.current.onclose = () => {
    //     console.log('WebSocket закрыт');
    //   };

    //   wsForLeftPanel.current.onerror = (err) => {
    //     console.log('WebSocket ошибка:', err);
    //   };

    //   wsForCurrentChat.current.onopen = () => {
    //     console.log('WebSocket для текущего чата открыт');
    //   };

    //   wsForCurrentChat.current.onmessage = (event) => {
    //     setCurrentChatData(event.data);
    //     console.log('WebSocket для текущего чата сообщение:', event.data);
    //   };

    //   wsForCurrentChat.current.onclose = () => {
    //     console.log('WebSocket для текущего чата закрыт');
    //   };

    //   wsForCurrentChat.current.onerror = (err) => {
    //     console.log('WebSocket для текущего чата ошибка:', err);
    //   };

    //   return () => {
    //     wsForLeftPanel.current?.close();
    //     wsForCurrentChat.current?.close();
    //   };
    // }, []);

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
    // Закрываем мобильное меню после выбора пользователя
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="container mx-auto max-w-full">
      {/* Header */}
      <header className="bg-white mx-1.5 mt-2 mb-1.5 p-3 flex flex-row items-center justify-between w-[calc(100vw-12px)] h-20 box-border shadow-lg">
        {/* Mobile hamburger menu */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-600"></div>
        </button>

        {/* Desktop Search */}
        <div className="hidden md:flex w-[20vw] min-w-[240px] ml-3 items-center h-9 px-3 border-2 border-blue-500 rounded-full bg-white box-border gap-2">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-sm leading-none p-0 m-0 h-full text-gray-700"
          />
          <span className="text-base w-6 flex items-center justify-center text-blue-500 h-full">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
            </svg>
          </span>
        </div>

        {/* Mobile: just title or empty space */}
        <div className="md:hidden flex-1 text-center">
          <CurrentChatUser iconPath="/globe.svg" userName="User Name" />
        </div>

        {/* Desktop: Current Chat User */}
        <div className="hidden md:block">
          <CurrentChatUser iconPath="/globe.svg" userName="User Name" />
        </div>
      </header>

      {/* Content */}
      <div className="mx-1.5 w-[calc(100vw-12px)] bg-white p-0.5 flex flex-row flex-grow h-[calc(100vh-80px-24px)] box-border shadow-xl relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* User List - Desktop & Mobile Sidebar */}
        <div
          className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          fixed md:relative 
          top-0 left-0 
          w-80 md:w-1/5 md:min-w-[250px] 
          h-full md:h-auto 
          m-0 md:m-5 
          p-4 md:p-0
          bg-white md:bg-transparent
          overflow-auto 
          transition-transform duration-300 ease-in-out 
          z-50 md:z-auto
          shadow-lg md:shadow-none
        `}
        >
          {/* Mobile close button */}
          <button
            className="md:hidden absolute top-4 right-4 p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Mobile Search */}
          <div className="md:hidden mt-12 mb-4">
            <div className="flex items-center h-9 px-3 border-2 border-blue-500 rounded-full bg-white box-border gap-2">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="flex-1 border-none outline-none bg-transparent text-sm leading-none p-0 m-0 h-full text-gray-700"
              />
              <span className="text-base w-6 flex items-center justify-center text-blue-500 h-full">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7"></circle>
                  <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                </svg>
              </span>
            </div>
          </div>

          {/* User List */}
          <div className="mt-0 md:mt-0">
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
        </div>

        {/* Chat Window */}
        <div className="w-full md:w-4/5 m-0 md:m-5 flex items-start justify-start flex-col bg-gray-50">
          {/* Chat Messages */}
          <div
            ref={chatRef}
            className="flex-grow overflow-y-auto p-2.5 w-full shadow-sm"
          >
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

          {/* Chat Input */}
          <div className="flex items-center justify-between p-2.5 w-full bg-white border-t border-gray-200">
            <input
              type="text"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-1/2 flex-grow border-none outline-none p-2.5 mr-2.5 text-sm rounded border border-gray-200"
            />
            <div className="mr-2.5 flex items-center justify-center rounded-lg w-10 h-10 bg-gray-100">
              <Image src="/smile.svg" alt="Smile Icon" width={24} height={24} />
            </div>
            <div className="mr-2.5 flex items-center justify-center rounded-lg w-10 h-10 bg-gray-100">
              <Image
                src="/attachment.svg"
                alt="Attach Icon"
                width={24}
                height={24}
              />
            </div>
            <button
              onClick={() => {
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
                setNewMessage('');
              }}
              type="submit"
              className="hidden bg-blue-500 w-3.5 text-white border-none h-10 px-2.5 rounded cursor-pointer"
            >
              Отправить
            </button>
            <button
              onClick={() => {
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
                setNewMessage('');
              }}
              type="submit"
              className="md:hidden bg-blue-500 w-10 h-10 flex items-center justify-center text-white border-none rounded cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 12L2 22l4-10L2 2l20 10z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
