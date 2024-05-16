import type { Metadata } from "next";
// Импортируем тип Metadata из библиотеки Next.js. 
// Этот тип используется для определения метаданных страницы.

import { Inter } from "next/font/google";
// Импортируем функцию Inter из библиотеки Next.js для работы с шрифтом Inter от Google Fonts.

import "../globals.css";
// Импортируем глобальные стили для вашего приложения из файла globals.css.

import { ClerkProvider } from "@clerk/nextjs";
// Импортируем компонент ClerkProvider из библиотеки @clerk/nextjs. 
// Этот компонент предоставляет контекст для использования Clerk в вашем приложении.

const inter = Inter({ subsets: ["latin"] });
// Инициализируем шрифт Inter с подмножеством "latin".

export const metadata: Metadata = {
  title: "Borcelle - Admin Auth",
  description: "Admin dashboard to manage Borcelle's data",
};
// Экспортируем объект metadata, который содержит метаданные страницы. 
// Заголовок страницы - "Borcelle - Admin Auth" и описание - "Admin dashboard to manage Borcelle's data".

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Определяем и экспортируем компонент RootLayout как функцию, которая принимает пропс children.
  // Используем Readonly для обеспечения неизменности пропса children и указываем, что он является React.ReactNode.
  return (
    <ClerkProvider>
      {/* Оборачиваем всё приложение в компонент ClerkProvider, чтобы предоставить контекст Clerk */}
      <html lang="en">
        {/* Определяем корневой элемент html с атрибутом lang="en" для указания языка документа */}
        <body className={inter.className}>
          {/* Устанавливаем класс для body, который включает стили шрифта Inter */}
          {children}
          {/* Рендерим дочерние компоненты, переданные в RootLayout */}
        </body>
      </html>
    </ClerkProvider>
  );
}
