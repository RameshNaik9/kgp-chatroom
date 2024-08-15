// /src/pages/ChatCPage.js
import React from 'react';
import ChatComponent from '../components/ChatComponent';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ChatPage = () => {
    return (
        <div className='h-100'>
            <Header/>
            <ChatComponent />
            <Footer/>
        </div>
    );
};

export default ChatPage;
