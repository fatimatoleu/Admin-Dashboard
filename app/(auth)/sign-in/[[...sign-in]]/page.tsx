import { SignIn } from "@clerk/nextjs";

// Импортируем компонент SignIn из библиотеки @clerk/nextjs. 
// Этот компонент используется для отображения формы входа в систему.

export default function Page() {
  return (
    // Определяем компонент Page как функцию, которая возвращает JSX.
    <div className="h-screen flex justify-center items-center">
      // Создаем контейнер div, который занимает всю высоту экрана (h-screen) 
      // и использует Flexbox для центрирования содержимого как по горизонтали, так и по вертикали (flex justify-center items-center).
      <SignIn />
      // Внутри контейнера div размещаем компонент SignIn, который отображает форму входа.
    </div>
  );
}
