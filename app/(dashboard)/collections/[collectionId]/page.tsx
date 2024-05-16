"use client"

// Указываем, что данный файл является клиентским компонентом в Next.js.

import { useEffect, useState } from "react"
// Импортируем хуки useEffect и useState из React.

import Loader from "@/components/custom ui/Loader"
// Импортируем компонент Loader из указанного пути.

import CollectionForm from "@/components/collections/CollectionForm"
// Импортируем компонент CollectionForm из указанного пути.

const CollectionDetails = ({ params }: { params: { collectionId: string }}) => {
  // Определяем компонент CollectionDetails, который принимает объект params с полем collectionId.

  const [loading, setLoading] = useState(true)
  // Определяем состояние loading с начальным значением true. Это состояние будет использоваться для отслеживания загрузки данных.

  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)
  // Определяем состояние collectionDetails, которое будет хранить данные о коллекции. Изначально оно равно null.

  const getCollectionDetails = async () => {
    // Определяем асинхронную функцию для получения данных о коллекции.
    try { 
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET"
      })
      // Выполняем GET-запрос к API для получения данных о коллекции по её ID.

      const data = await res.json()
      // Преобразуем ответ в JSON-формат.

      setCollectionDetails(data)
      // Обновляем состояние collectionDetails полученными данными.

      setLoading(false)
      // Устанавливаем состояние loading в false, так как данные успешно загружены.
    } catch (err) {
      console.log("[collectionId_GET]", err)
      // Обрабатываем ошибки, возникающие при выполнении запроса, и выводим их в консоль.
    }
  }

  useEffect(() => {
    getCollectionDetails()
    // Используем хук useEffect для вызова функции getCollectionDetails при монтировании компонента.
  }, [])

  return loading ? <Loader /> : (
    // Возвращаем компонент Loader, если состояние loading равно true. 
    // В противном случае рендерим компонент CollectionForm с переданными начальными данными.
    <CollectionForm initialData={collectionDetails}/>
  )
}

export default CollectionDetails
// Экспортируем компонент CollectionDetails по умолчанию.
