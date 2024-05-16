"use client"

// Указываем, что данный файл является клиентским компонентом в Next.js.

import { DataTable } from "@/components/custom ui/DataTable"
// Импортируем компонент DataTable из указанного пути.

import Loader from "@/components/custom ui/Loader"
// Импортируем компонент Loader из указанного пути.

import { columns } from "@/components/orders/OrderColumns"
// Импортируем массив колонок для таблицы из указанного пути.

import { Separator } from "@/components/ui/separator"
// Импортируем компонент Separator из указанного пути.

import { useEffect, useState } from "react"
// Импортируем хуки useEffect и useState из React.

const Orders = () => {
  // Определяем компонент Orders как функциональный компонент.

  const [loading, setLoading] = useState(true)
  // Определяем состояние loading с начальным значением true. Это состояние будет использоваться для отслеживания загрузки данных.

  const [orders, setOrders] = useState([])
  // Определяем состояние orders, которое будет хранить данные о заказах. Изначально оно равно пустому массиву.

  const getOrders = async () => {
    // Определяем асинхронную функцию для получения данных о заказах.
    try {
      const res = await fetch(`/api/orders`)
      // Выполняем GET-запрос к API для получения данных о заказах.

      const data = await res.json()
      // Преобразуем ответ в JSON-формат.

      setOrders(data)
      // Обновляем состояние orders полученными данными.

      setLoading(false)
      // Устанавливаем состояние loading в false, так как данные успешно загружены.
    } catch (err) {
      console.log("[orders_GET", err)
      // Обрабатываем ошибки, возникающие при выполнении запроса, и выводим их в консоль.
    }
  }

  useEffect(() => {
    getOrders()
    // Используем хук useEffect для вызова функции getOrders при монтировании компонента.
  }, [])

  return loading ? <Loader /> : (
    // Возвращаем компонент Loader, если состояние loading равно true. 
    // В противном случае рендерим содержимое страницы с заказами.
    <div className="px-10 py-5">
      {/* Контейнер для содержимого с отступами по осям X и Y */}
      <p className="text-heading2-bold">Orders</p>
      {/* Заголовок страницы */}
      <Separator className="bg-grey-1 my-5"/>
      {/* Разделитель между заголовком и таблицей */}
      <DataTable columns={columns} data={orders} searchKey="_id" />
      {/* Компонент DataTable для отображения данных о заказах в виде таблицы. */}
    </div>
  )
}

export const dynamic = "force-dynamic"
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.

export default Orders
// Экспортируем компонент Orders по умолчанию.
