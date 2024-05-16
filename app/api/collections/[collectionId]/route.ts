import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

import { auth } from "@clerk/nextjs";
// Импортируем функцию аутентификации из библиотеки @clerk/nextjs.

import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import Collection from "@/lib/models/Collection";
// Импортируем модель Collection из указанного пути.

import Product from "@/lib/models/Product";
// Импортируем модель Product из указанного пути.

export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const collection = await Collection.findById(params.collectionId).populate({ path: "products", model: Product });
    // Находим коллекцию по ID и заполняем поле products данными из модели Product.

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
      // Возвращаем ошибку 404, если коллекция не найдена.
    }

    return NextResponse.json(collection, { status: 200 });
    // Возвращаем найденную коллекцию с статусом 200.
  } catch (err) {
    console.log("[collectionId_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  // Определяем асинхронную функцию для обработки POST-запросов.
  try {
    const { userId } = auth();
    // Получаем ID пользователя из контекста аутентификации.

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
      // Возвращаем ошибку 401, если пользователь не аутентифицирован.
    }

    await connectToDB();
    // Подключаемся к базе данных.

    let collection = await Collection.findById(params.collectionId);
    // Находим коллекцию по ID.

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
      // Возвращаем ошибку 404, если коллекция не найдена.
    }

    const { title, description, image } = await req.json();
    // Получаем данные из тела запроса.

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
      // Возвращаем ошибку 400, если отсутствуют обязательные поля title и image.
    }

    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, description, image },
      { new: true }
    );
    // Обновляем коллекцию с новыми данными.

    await collection.save();
    // Сохраняем изменения в коллекции.

    return NextResponse.json(collection, { status: 200 });
    // Возвращаем обновленную коллекцию с статусом 200.
  } catch (err) {
    console.log("[collectionId_POST]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  // Определяем асинхронную функцию для обработки DELETE-запросов.
  try {
    const { userId } = auth();
    // Получаем ID пользователя из контекста аутентификации.

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
      // Возвращаем ошибку 401, если пользователь не аутентифицирован.
    }

    await connectToDB();
    // Подключаемся к базе данных.

    await Collection.findByIdAndDelete(params.collectionId);
    // Удаляем коллекцию по ID.

    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    );
    // Обновляем все продукты, удаляя ссылку на удаленную коллекцию.

    return new NextResponse("Collection is deleted", { status: 200 });
    // Возвращаем сообщение об успешном удалении коллекции с статусом 200.
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
