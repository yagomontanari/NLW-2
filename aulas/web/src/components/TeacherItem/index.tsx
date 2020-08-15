import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'

import './styles.css'

function TeacherItem() {
    return (
        <article className="teacher-item">
            <header>
                <img src="https://pbs.twimg.com/profile_images/1252817847429894152/Kh4GFovk_400x400.jpg" alt="Yago Montanari" />
                <div>
                    <strong>Yago Montanari</strong>
                    <span>ReactJS</span>
                </div>
            </header>

            <p>
                Professor Extraordinário de ReactJS
            <br /><br />
            Especialista em layouts, desenvolvimento de software com JavaScript, React, ReactJS, ReactNative, DOM, etc...
        </p>

            <footer>
                <p>
                    Preço/hora
              <strong>R$ 80,00</strong>
                </p>
                <button type="button">
                    <img src={whatsappIcon} alt="Whatsapp" />
                Entrar em contato
            </button>
            </footer>
        </article>
    );
}

export default TeacherItem;