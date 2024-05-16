"use client"

// Указываем, что данный файл является клиентским компонентом в Next.js.

import Loader from '@/components/custom ui/Loader'
// Импортируем компонент Loader из указанного пути.

import ProductForm from '@/components/products/ProductForm'
// Импортируем компонент ProductForm из указанного пути.

import React, { useEffect, useState } from 'react'
// Импортируем React и хуки useEffect и useState.

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  // Определяем компонент ProductDetails, который принимает объект params с полем productId.

  const [loading, setLoading] = useState(true)
  // Определяем состояние loading с начальным значением true. Это состояние будет использоваться для отслеживания загрузки данных.

  const [productDetails, setProductDetails] = useState<ProductType | null>(null)
  // Определяем состояние productDetails, которое будет хранить данные о продукте. Изначально оно равно null.

  const getProductDetails = async () => {
    // Определяем асинхронную функцию для получения данных о продукте.
    try { 
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      })
      // Выполняем GET-запрос к API для получения данных о продукте по его ID.

      const data = await res.json()
      // Преобразуем ответ в JSON-формат.

      setProductDetails(data)
      // Обновляем состояние productDetails полученными данными.

      setLoading(false)
      // Устанавливаем состояние loading в false, так как данные успешно загружены.
    } catch (err) {
      console.log("[productId_GET]", err)
      // Обрабатываем ошибки, возникающие при выполнении запроса, и выводим их в консоль.
    }
  }

  useEffect(() => {
    getProductDetails()
    // Используем хук useEffect для вызова функции getProductDetails при монтировании компонента.
  }, [params.productId])
  // Добавляем зависимость params.productId, чтобы функция getProductDetails вызывалась при изменении этого параметра.

  return loading ? <Loader /> : (
    // Возвращаем компонент Loader, если состояние loading равно true. 
    // В противном случае рендерим компонент ProductForm с переданными начальными данными.
    <ProductForm initialData={productDetails} />
  )
}

export default ProductDetails
// Экспортируем компонент ProductDetails по умолчанию.
