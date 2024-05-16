"use client";

// Указываем, что данный файл является клиентским компонентом в Next.js.

import { useRouter } from "next/navigation";
// Импортируем хук useRouter из библиотеки Next.js для работы с маршрутизацией.

import { useEffect, useState } from "react";
// Импортируем хуки useEffect и useState из React.

import { Plus } from "lucide-react";
// Импортируем иконку Plus из библиотеки lucide-react.

import Loader from "@/components/custom ui/Loader";
// Импортируем компонент Loader из указанного пути.

import { Button } from "@/components/ui/button";
// Импортируем компонент Button из указанного пути.

import { Separator } from "@/components/ui/separator";
// Импортируем компонент Separator из указанного пути.

import { DataTable } from "@/components/custom ui/DataTable";
// Импортируем компонент DataTable из указанного пути.

import { columns } from "@/components/products/ProductColumns";
// Импортируем массив колонок для таблицы из указанного пути.

const Products = () => {
  // Определяем компонент Products как функциональный компонент.

  const router = useRouter();
  // Инициализируем хук useRouter для работы с маршрутизацией.

  const [loading, setLoading] = useState(true);
  // Определяем состояние loading с начальным значением true. Это состояние будет использоваться для отслеживания загрузки данных.

  const [products, setProducts] = useState<ProductType[]>([]);
  // Определяем состояние products, которое будет хранить данные о продуктах. Изначально оно равно пустому массиву.

  const getProducts = async () => {
    // Определяем асинхронную функцию для получения данных о продуктах.
    try {
      const res = await fetch("/api/products", {
        method: "GET",
      });
      // Выполняем GET-запрос к API для получения данных о продуктах.

      const data = await res.json();
      // Преобразуем ответ в JSON-формат.

      setProducts(data);
      // Обновляем состояние products полученными данными.

      setLoading(false);
      // Устанавливаем состояние loading в false, так как данные успешно загружены.
    } catch (err) {
      console.log("[products_GET]", err);
      // Обрабатываем ошибки, возникающие при выполнении запроса, и выводим их в консоль.
    }
  };

  useEffect(() => {
    getProducts();
    // Используем хук useEffect для вызова функции getProducts при монтировании компонента.
  }, []);

  return loading ? (
    <Loader />
  ) : (
    // Возвращаем компонент Loader, если состояние loading равно true. 
    // В противном случае рендерим содержимое страницы с продуктами.
    <div className="px-10 py-5">
      {/* Контейнер для содержимого с отступами по осям X и Y */}
      <div className="flex items-center justify-between">
        {/* Контейнер с использованием Flexbox для выравнивания элементов по центру и распределения пространства между ними */}
        <p className="text-heading2-bold">Products</p>
        {/* Заголовок страницы */}
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/products/new")}
        >
          {/* Кнопка для создания нового продукта с вызовом функции router.push для перехода на страницу создания нового продукта */}
          <Plus className="h-4 w-4 mr-2" />
          {/* Иконка плюс перед текстом на кнопке */}
          Create Product
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      {/* Разделитель между заголовком и таблицей */}
      <DataTable columns={columns} data={products} searchKey="title" />
      {/* Компонент DataTable для отображения данных о продуктах в виде таблицы. */}
    </div>
  );
};

export default Products;
// Экспортируем компонент Products по умолчанию.
