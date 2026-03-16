const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Минимфикация файлов css
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
        path: path.resolve(__dirname, 'build'), // Сборка в папку build
        publicPath: '/',
        filename: '[name].[contenthash].js',  // Динамические имена для чанков
        clean: true, // Очищает папку build автоматически
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
                use: [MiniCssExtractPlugin.loader, 'css-loader'], // Используем MiniCssExtractPlugin для CSS
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
                    to: path.resolve(__dirname, 'build'), // Копируем в build, а не в dist
                    globOptions: {
                        ignore: ['**/index.html'] // Игнорируем index.html, так как он обрабатывается HtmlWebpackPlugin
                    },
                    noErrorOnMissing: true // Не ругайся, если папка с файлами пуста
                }
            ]
        }),
        // Анализатор занятости места
        // new BundleAnalyzerPlugin(),
        // Очистка перед каждой сборкой (можно убрать, так как output.clean: true)
        // new CleanWebpackPlugin()
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
