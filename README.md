# react-webpack

> Дата обновления инструкции: `02.10.2025`

## Запуск проекта react на webpack
```cmd
npm run start -dev
```
```cmd
npm run start
```

## Сборка прокта
```cmd
npm run build
```

### Подготовка react на webpack
1. Запустите:

```cmd
npm init -y
```

или, если нужна ручная настройка `package.json`

```cmd
npm init
```

2. Устанавливаем зависимости react

```cmd
npm install react react-dom
```

3. Typescript

```cmd
npm install --save-dev typescript @types/react @types/react-dom
```

4. Webpack

```cmd
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
```

5. Loaders

```cmd
npm install --save-dev ts-loader css-loader style-loader file-loader
```

6. Создаём файл tsconfig.json в корне репозитория с содержимым:

```ts
{
    "compilerOptions": {
        "target": "es2016",
        "lib": ["dom", "dom.iterable", "esnext"],
        "jsx": "react-jsx",
        "module": "esnext",
        "moduleResolution": "node",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "noEmit": false,
        "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

7. Создаём файл `webpack.config.ts`:
```ts
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Минимзация файлов css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

// Нужен для анализа, при финальной сборке проверить на память
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
// Очистка папок и кеша при каждой сборке
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

// Оптимизация
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // Готовый продукт
    // mode: 'production',
    // Сборка для разработки
    mode: 'development',
    // Подключение map к сборке
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].[contenthash].js',  // Динамические имена для чанков
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true, // Ускоряем минификацию
        })],
        splitChunks: {
            chunks: 'all', // Разделяем vendor код
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true, // Ускоряет сборку
                        experimentalWatchApi: true, // Улучшает watch mode
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ca]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext][query]' // Организация ассетов
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', // Добавляем хеш
        }),
        new Dotenv(), // загружает переменные из .env
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public'),
                    to: path.resolve(__dirname, 'build'),
                    globOptions: {
                        ignore: ['**/index.html']
                    },
                    noErrorOnMissing: true // Не ругайся, если папка с файлами пуста
                }
            ]
        }),
        // Анализатор занятости места
        // new BundleAnalyzerPlugin(),
        // Очистка перед каждой сборкой
        new CleanWebpackPlugin()
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        watchFiles: ['src/**/*', 'public/**/*'], // Явно указываем за какими файлами следить
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        }
    },
};
```

8. Создаём файл `index.html` в папке `public`:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React TypeScript App</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

9. В папке `src` -> файл `index.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

Обратить внимение на <React.StrictMode> вызывает api запросы повторно (2 раза), для dev - допустимо, при раскатке - убрать

10. В папке `src` -> файл `App.tsx`

```tsx
import { BrowserRouter } from "react-router-dom";
import Router from "../router/Router";

function App() {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
}

export default App;
```

и устанавливаем `router`

```cmd
npm install react-router-dom --save
```

создаём папку `router` -> с файлом `Router.tsx` в `src`

```tsx
import { Route, Routes } from 'react-router-dom';

import MainPage from '../pages/MainPage';

const Router = () => {
    return (
        <Routes>
            <Route path="/" index element={<MainPage />} />
        </Routes>
    );
};

export default Router;
```

11. В папке `src` -> создаём папку `pages` -> файл `MainPage.tsx`

```tsx
const MainPage = () => {
    return <div>
        Main Page
    </div>
}

export default MainPage;
```

12. Переназначаем конфликтные import в файлах, котоыре светятся с ошибками

13. В папке `src` -> папку `styles` -> файл `index.scss` или `index.css`:

В файле `index.tsx` подключён `index.scss` через import, переключить на своё расширение

```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}
```

14. `package.json` добиваем:

Там есть раздел `"scripts": {}` со своими командами, нужно заменить:
```json
...
"scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

15. Используем `ts` в `webpack`

```cmd
npm install --save-dev typescript ts-node
```

---

```cmd
npm install --save-dev @types/node
```

16. Устанавливаем plugin для улучшения webpack

```cmd
npm install copy-webpack-plugin --save-dev
```

---

```cmd
npm i mini-css-extract-plugin --save-dev
```

---

```cmd
npm i webpack-bundle-analyzer --save-dev
```

---

```cmd
npm i clean-webpack-plugin --save-dev
```

---

```cmd
npm install sass-loader sass webpack --save-dev
```

17. Устанавливаем `mobx` или `redux`, описаны будут позже

18. Создаём в корне репозитория файлы: `.env` и ` .env.production`

```cmd
REACT_APP_BASEURL=http://localhost:3001
```

где `http://localhost:3001` адрес сервера backend для dev-разработки и production

устанавливаем работу с `.env` в webpack
```cmd
npm install dotenv-webpack --save-dev
```

19. Запускаем сборку
    Для разработки

```cmd
npm run start --dev
```

Для production

```cmd
npm run start
```

20. Устанавливаем `axios` для работы с api

```cmd
npm install axios
```

21. Создаём файл в `src` -> `api` -> `index.ts`

```tsx
import axios from "axios";

export const $api = axios.create({
    baseURL: `${process.env.REACT_APP_BASEURL}`,
});

export const config = () => {
    return {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Origin': '*'
    }
}

$api.interceptors.response.use(function (response) {
    // Любой код состояния, находящийся в диапазоне 2xx, вызывает срабатывание этой функции
    // Здесь можете сделать что-нибудь с ответом
    return response;
}, function (error) {
    if (error.response != null) {
        const numberStatus: number = Math.round(error.response.status / 100);
        switch (numberStatus) {
            case 4:
                switch (error.response.status) {
                    case 400:
                        window.location.replace(`/error?code=${error.response.status}`);
                        break;
                    case 401:
                    case 403:
                        // Переход. Если не прошёл авторизацию
                        window.location.replace("/");
                        break;
                    case 404:
                    case 405:
                        window.location.replace(`/error?code=${error.response.status}`);
                        break;
                }
                break;
            case 5:
                // if (error.response.status >= 500 && error.response.status <= 505) {
                //     window.location.replace(`/error?code=${error.response.status}`);
                // }
                break;
            default:
                // window.location.replace("/error");
                break;
        }
    }

    // if (error.response == null) {
    //     window.location.replace("/error");
    //     return;
    // }

    // Любые коды состояния, выходящие за пределы диапазона 2xx, вызывают срабатывание этой функции
    // Здесь можете сделать что-то с ошибкой ответа
    return Promise.reject(error);
});
```

22. В папке `api` создаём папку `controllers` -> файл `___-controller.ts`, в моём случае `common-controller.ts`

```tsx
import { $api, config } from "../index";

export const getCommon = () => {
    return $api.get('/api', { headers: config() });
}
```

В `MainPage` для запроса используем `useEffect`

```tsx
useEffect(() => {
  getCommon()
    .then((response) => {
      console.log(response);
    })
    .catch((e) => console.log(e));
}, []);
```

`getCommon` - это контроллер в `common-controller.ts`, чтобы он отработал нужно:

- Запрос через `axios` не сработает из-за `cors`, нужно отключить cors в браузере и пользоваться
  -Для отключения `cors` надо в ярлыке браузере Google через свойство в поле `объект` вставить после расположения строки:

```
--disable-web-security --user-data-dir="C:\Users\ndecarteret121\AppData\Local\Google\Chrome\Testing"
```

Снятие защиты с браузера (перевод в тестовый режим)

Запрос будет не корректный, если backend-сервер не будут запущен

Смотрим файл `MainPage.tsx` для работы с вытаскиванием данных с сервера

23. Создаём папки
 - `components` в `components`
 - `layouts` в `components`
 - `types`
 - `store`

---
#### Настроенный `webpack.config.ts`:
```ts
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Минимзация файлов css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

// Нужен для анализа, при финальной сборке проверить на память
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
// Очистка папок и кеша при каждой сборке
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

// Оптимизация
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // Готовый продукт
    // mode: 'production',
    // Сборка для разработки
    mode: 'development',
    // Подключение map к сборке
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].[contenthash].js',  // Динамические имена для чанков
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true, // Ускоряем минификацию
        })],
        splitChunks: {
            chunks: 'all', // Разделяем vendor код
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true, // Ускоряет сборку
                        experimentalWatchApi: true, // Улучшает watch mode
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ca]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext][query]' // Организация ассетов
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', // Добавляем хеш
        }),
        new Dotenv(), // загружает переменные из .env
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public'),
                    to: path.resolve(__dirname, 'build'),
                    globOptions: {
                        ignore: ['**/index.html']
                    },
                    noErrorOnMissing: true // Не ругайся, если папка с файлами пуста
                }
            ]
        }),
        // Анализатор занятости места
        // new BundleAnalyzerPlugin(),
        // Очистка перед каждой сборкой
        new CleanWebpackPlugin()
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        watchFiles: ['src/**/*', 'public/**/*'], // Явно указываем за какими файлами следить
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        }
    },
};
```
---
Подключение `mobx` в проект
```cmd
npm install mobx mobx-react
```

Создать папку `store` и внутри файл `store.ts` c содержимым
```ts
import { makeAutoObservable } from 'mobx';
import { createContext } from "react";

class Store {
    cart = [];
    categories = [];
    products = [];

    constructor() {
        makeAutoObservable(this);
    }
}

export const store = new Store();
export const storeContext = createContext(store);
```

Но чтобы проект заработал нужно перейти в `index.tsx` и добавить строки:
```tsx
...
import { Provider } from 'mobx-react';
import { store } from './store/store'; // или другой файл
...

...
<Provider store={store}>
    <App />
</Provider>
...
```

### Mobx (расширенный, для больших проектов)

1. Установите MobX и React интеграцию

```bash
npm install mobx mobx-react
```

2. Основные концепции:

- Observable state - данные, за которыми следит MobX
- Actions - методы, которые изменяют состояние
- Computed values - производные значения из состояния
- Reactions - автоматические реакции на изменения состояния

3. Создаём `CouterStore.ts` в папке `stores` -> `store`
```tsx
import { makeObservable, observable, action } from 'mobx';

class CounterStore {
    count = 0;

    constructor() {
        makeObservable(this, {
            count: observable, // отслеживание переменной
            increment: action, // метод изменения данных
            decrement: action
        });
    }

    increment = () => {
        this.count++;
    };

    decrement = () => {
        this.count--;
    };
}

const counterStore = new CounterStore();
export default counterStore;
```

4. Обернуть `react-компонент` в `observer`, чтобы взаимодействовать с данными

```tsx
import { observer } from "mobx-react";

const Mobx = observer(() => {
    return <div>

    </div>
});

export default Mobx;
```

5. Данные можно изменять, и смотреть

```tsx
import counterStore from "../../stores/store/CounterStore";

import { observer } from "mobx-react";

const Mobx = observer(() => {
    return <div>
        <h1>{counterStore.count}</h1>
        <button onClick={counterStore.increment}>+</button>
        <button onClick={counterStore.decrement}>-</button>
        <h2>{counterStore.doubleCount}</h2>
    </div>
});

export default Mobx;
```

6. Создаём `TestStore.ts` в папке `stores` -> `store`
```tsx
import { makeObservable, observable, action, runInAction, computed } from 'mobx';
import { testData } from '../../api/controllers/common-controller';
import { testDataDto } from '../../types/testData';

export class TestStore {
    testData: testDataDto[] = [];
    loading = false;
    error = false;

    constructor() {
        makeObservable(this, {
            testData: observable,
            loading: observable,
            error: observable,
            dataLength: computed,
            fetchData: action
        });
    }

    fetchData = async () => {
        this.loading = true;

        await testData()
            .then((response) => {
                runInAction(() => {
                    this.testData = response.data;
                    this.loading = false;
                })
            })
            .catch((error) => {
                console.log(error);
                runInAction(() => {
                    this.error = true;
                    this.loading = false;
                })
            })
    };

    get dataLength() {
        return this.testData.length;
    }
}
```

7. Данные можно просмотреть
```tsx
import { observer } from "mobx-react";
import counterStore from "../../stores/store/CounterStore";
import testStore from "../../stores/store/TestStore";
import { useEffect } from "react";

const Mobx = observer(() => {
    useEffect(() => {
        testStore.fetchData()
    }, [])

    return <div>
        <h1>{counterStore.count}</h1>
        <button onClick={counterStore.increment}>+</button>
        <button onClick={counterStore.decrement}>-</button>
        <h2>{counterStore.doubleCount}</h2>
        <hr></hr>
        {testStore.loading ?
            'Загрузка'
            :
            (
                <>
                    <ol>
                        {
                            testStore.testData.map((item, ind) => (
                                <li key={ind}>
                                    {item.id} / {item.name} / {item.age}
                                </li>
                            ))
                        }
                    </ol>
                    {testStore.error ? null : testStore.dataLength}
                </>
            )
        }
        {testStore.error ? 'Ошибка' : null}
    </div>
});

export default Mobx;
```

8. Запуск через единый `root-файл`
в папке `stores` создаём `RootStore.ts`
```tsx
import { makeObservable } from 'mobx';
import { TestStore } from './store/TestStore';
import { CounterStore } from './store/CounterStore';

export class RootStore {
    testStore: TestStore;
    counterStore: CounterStore;

    constructor() {
        // Передаем текущий экземпляр RootStore в дочерние хранилища
        this.testStore = new TestStore(this);
        this.counterStore = new CounterStore(this);

        //  Настройка MobX наблюдение
        // - this: наблюдаемый объект
        // - {}: нет полей для наблюдения (они в дочерних хранилищах)
        // - { autoBind: true }: автоматическая привязка методов
        makeObservable(this, {}, { autoBind: true });
    }
}

// Создаем экземпляр корневого хранилища
const rootStore = new RootStore();
export default rootStore;
```

в папке `stores` создаём `RootStoreContext.ts`
```tsx
import { createContext, useContext } from 'react';
import { RootStore } from './RootStore';

export const RootStoreContext = createContext<RootStore | null>(null);

export const useStores = () => {
    const store = useContext(RootStoreContext);
    if (!store) {
        throw new Error('useStores must be used within a StoreProvider');
    }
    return store;
};
```

В `index.tsx` добавить
```tsx
...
import { RootStoreContext } from './stores/RootStoreContext';
import rootStore from './stores/RootStore';
...

...
<RootStoreContext.Provider value={rootStore}>
    <App />
</RootStoreContext.Provider>
...
```

Компонент `Mobx.tsx`
```tsx
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useStores } from "../../stores/RootStoreContext";

const Mobx = observer(() => {
    // Получаем хранилища через контекст
    const { testStore, counterStore } = useStores();

    useEffect(() => {
        testStore.fetchData()
    }, [])

    return <div>
        <h1>{counterStore.count}</h1>
        <button onClick={counterStore.increment}>+</button>
        <button onClick={counterStore.decrement}>-</button>
        <h2>{counterStore.doubleCount}</h2>
        <hr></hr>
        {testStore.loading ?
            'Загрузка'
            :
            (
                <>
                    <ol>
                        {
                            testStore.testData.map((item, ind) => (
                                <li key={ind}>
                                    {item.id} / {item.name} / {item.age}
                                </li>
                            ))
                        }
                    </ol>
                    {testStore.error ? null : testStore.dataLength}
                </>
            )
        }
        {testStore.error ? 'Ошибка' : null}
    </div>
});

export default Mobx;
```

В файлах `CounterStore.ts` `TestStore.ts` тоже есть небольшие изменения и можно комбинировать между несколькими `store`
```tsx
import { makeObservable, observable, action, computed } from 'mobx';
import { RootStore } from '../RootStore';

export class CounterStore {
    count = 0;

    constructor(private rootStore: RootStore) { // добавляется зависимость
        makeObservable(this, {
            count: observable, // отслеживание переменной
            increment: action, // метод изменения данных
            decrement: action,
            doubleCount: computed // производные значения (просмотр) на основе данных, хранящихся в class
        });
    }

    increment = () => {
        this.count++;
    };

    decrement = () => {
        this.count--;
    };

    get doubleCount() { // используется для просмотра количества элементов в массиве, или другие данные, которые пересчитываются на основе переменных используемые в class
        return this.count * 2;
    };

    // Пример использования другого хранилища
    resetIfTestDataEmpty = () => {
        if (this.rootStore.testStore.dataLength === 0) {
            this.count = 0;
        }
    };
}
```

```tsx
import { makeObservable, observable, action, runInAction, computed } from 'mobx';
import { testData } from '../../api/controllers/common-controller';
import { testDataDto } from '../../types/testData';
import { RootStore } from '../RootStore';

export class TestStore {
    testData: testDataDto[] = [];
    loading = false;
    error = false;

    constructor(private rootStore: RootStore) { // добавляется зависимость
        makeObservable(this, {
            testData: observable,
            loading: observable,
            error: observable,
            dataLength: computed,
            fetchData: action
        });
    }

    fetchData = async () => {
        this.loading = true;

        await testData()
            .then((response) => {
                runInAction(() => {
                    this.testData = response.data;
                    this.loading = false;
                })
            })
            .catch((error) => {
                console.log(error);
                runInAction(() => {
                    this.error = true;
                    this.loading = false;
                })
            })
    };

    get dataLength() {
        return this.testData.length;
    }

    // Пример использования другого хранилища
    get countFromCounterStore() {
        return this.rootStore.counterStore.count;
    }
}
```

9. Реакции `Mobx`
* autorun
Выполняет функцию сразу и при каждом изменении зависимостей:
```tsx
import { autorun } from 'mobx';

autorun(() => {
  console.log(`Данные загружены: ${store.testData.length} элементов`);
});
```
- Используйте для логирования, аналитики или синхронизации с localStorage.
---
* reaction
Запускает эффект только при изменении конкретных данных:
```tsx
import { reaction } from 'mobx';

reaction(
  () => store.testData.length, // Отслеживаемое значение
  (length) => {
    if (length > 10) alert('Данных больше 10!');
  }
);
```
- Используйте для условных действий (например, уведомлений).
---
* when
Выполняет действие один раз при выполнении условия:
```tsx
import { when } from 'mobx';

when(
  () => store.testData.length > 0,
  () => {
    console.log('Данные наконец загружены!');
  }
);
```
- Используйте для одноразовых инициализаций.
