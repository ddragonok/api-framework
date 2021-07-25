import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import LikeApi from "../src/http/LikeApi";

describe('Проверка функционала лайков', async() => {
    let idRandomCat
    let amountLikes
    const n = 5

    after('Возврат к начальному количеству лайков',async() => {
        await allure.step('Возвращение начального количества лайков', async() => {
            console.info('Возвращение начального количества лайков')
            for (let i = 0; i < n; i++) {
                await LikeApi.likes(idRandomCat, {like: false, dislike: null})
            }
            const responseRandomCat = await CoreApi.getCatById(idRandomCat)
            assert.ok(responseRandomCat.data.cat.likes === amountLikes, 'Начальное количество лайков не восстановилось!' )
            allure.attachment('Количество лайков после восстановления', JSON.stringify(responseRandomCat.data.cat.likes, null, 2), 'application/json')
            console.info(`Количество лайков после восстановления: ${responseRandomCat.data.cat.likes}\n`)
        })
    })

    it('Проверка лайков', async () => {
        console.info('Тест: Проверка лайков')
        const getRandomInt = (max: number) => Math.floor(Math.random() * max)

        idRandomCat = await allure.step(`Получение случайного кота`, async () => {
            console.info('Выполняется запрос GET /all');
            const responseAllCats = await CoreApi.getAllCats();
            console.info('Получен ответ на запрос GET /all. Получен список всех котов\nИз списка выбрали случайного кота:');
            const randomGroups = getRandomInt(responseAllCats.data.groups.length)
            const randomCats = getRandomInt(responseAllCats.data.groups[randomGroups].cats.length)
            const randomCat = JSON.stringify(responseAllCats.data.groups[randomGroups].cats[randomCats], null, 2)
            console.info(randomCat)
            allure.attachment('Случайный кот', randomCat, 'application/json');
            const idRandomCat = responseAllCats.data.groups[randomGroups].cats[randomCats].id
            return idRandomCat
        });

        amountLikes = await allure.step(`Получение лайков кота`, async () => {
            console.info('Выполняется запрос GET /get-by-id')
            const responseRandomCat = await CoreApi.getCatById(idRandomCat)
            const amountLikes = responseRandomCat.data.cat.likes
            allure.attachment('Лайки найденного кота', JSON.stringify(amountLikes, null, 2), 'application/json')
            console.info('Получен ответ на запрос GET /get-by-id\nЛайки найденного кота:', amountLikes)
            return amountLikes
        })

        await allure.step(`Поставить n = ${n} лайков коту`, async () => {
            console.info('Выполняется запрос POST /likes ', n, 'раз')
            for (let i = 0; i < n; i++) {
                await LikeApi.likes(idRandomCat, {like: true, dislike: null})
            }
            console.info(`Выполнен запрос POST /likes ${n} раз, поставлено ${n} лайков найденному коту`)
        })

        await allure.step(`Проверка того, что количество лайков соответствует ожидаемому`, async () => {
            console.info('Выполняется запрос GET /get-by-id')
            const responseRandomCat = await CoreApi.getCatById(idRandomCat)
            const randomCat = JSON.stringify(responseRandomCat.data, null, 2)
            console.info('Получен ответ на запрос GET /get-by-id\nКот после проставления лайков:', randomCat)
            allure.attachment('Кот после проставления лайков', randomCat, 'application/json')
            assert.ok(responseRandomCat.data.cat.likes === (amountLikes + n), 'Количество лайков не соответствует ожидаемому!')
            console.info(`Теперь количество лайков у кота: ${amountLikes + n}`)
        })
    })
})

describe('Проверка функционала дизлайков', async() => {
    let idRandomCat
    let amountDislikes
    const m = 6

    after('Возврат к начальному количеству дизлайков',async() => {
        await allure.step('Возвращение начального количества дизлайков', async() => {
            console.info('Возвращение начального количества дизлайков')
            for (let i = 0; i < m; i++) {
                await LikeApi.likes(idRandomCat, {like: null, dislike: false})
            }
            const responseRandomCat = await CoreApi.getCatById(idRandomCat)
            assert.ok(responseRandomCat.data.cat.dislikes === amountDislikes, 'Начальное количество дизлайков не восстановилось!' )
            allure.attachment('Количество дизлайков после восстановления', JSON.stringify(responseRandomCat.data.cat.dislikes, null, 2), 'application/json')
            console.info(`Количество дизлайков после восстановления: ${responseRandomCat.data.cat.dislikes}\n`)
        })
    })

    it('Проверка дизлайков', async () => {
        console.info('Тест: Проверка дизлайков')
        const getRandomInt = (max: number) => Math.floor(Math.random() * max);

        idRandomCat = await allure.step(`Получение случайного кота`, async () => {
            console.info('Выполняется запрос GET /all');
            const responseAllCats = await CoreApi.getAllCats();
            console.info('Получен ответ на запрос GET /all. Получен список всех котов\nИз списка выбрали случайного кота:');
            const randomGroups = getRandomInt(responseAllCats.data.groups.length)
            const randomCats = getRandomInt(responseAllCats.data.groups[randomGroups].cats.length)
            const randomCat = JSON.stringify(responseAllCats.data.groups[randomGroups].cats[randomCats], null, 2)
            console.info(randomCat)
            allure.attachment('Случайный кот', randomCat, 'application/json');
            const idRandomCat = responseAllCats.data.groups[randomGroups].cats[randomCats].id
            return idRandomCat
        });

        amountDislikes = await allure.step(`Получение дизлайков кота`, async () => {
            console.info('Выполняется запрос GET /get-by-id')
            const responseRandomCat = await CoreApi.getCatById(idRandomCat)
            const amountDislikes = responseRandomCat.data.cat.dislikes
            allure.attachment('Дизлайки найденного кота', JSON.stringify(amountDislikes, null, 2), 'application/json')
            console.info('Получен ответ на запрос GET /get-by-id\nДизлайки найденного кота:', amountDislikes)
            return amountDislikes
        })

        await allure.step(`Поставить m = ${m} дизлайков коту`, async () => {
            console.info('Выполняется запрос POST /likes ', m, 'раз')
            for (let i = 0; i < m; i++) {
                await LikeApi.likes(idRandomCat, {like: null, dislike: true})
            }
            console.info(`Выполнен запрос POST /likes ${m} раз, поставлено ${m} дизлайков найденному коту`)
        })

        await allure.step(`Проверка того, что количество дизлайков соответствует ожидаемому`, async () => {
            console.info('Выполняется запрос GET /get-by-id')
            const responseRandomCat = await CoreApi.getCatById(idRandomCat)
            const randomCat = JSON.stringify(responseRandomCat.data, null, 2)
            console.info('Получен ответ на запрос GET /get-by-id\nКот после проставления дизлайков:', randomCat)
            allure.attachment('Кот после проставления дизлайков', randomCat, 'application/json')
            assert.ok(responseRandomCat.data.cat.dislikes === (amountDislikes + m), 'Количество дизлайков не соответствует ожидаемому!')
            console.info(`Теперь количество дизлайков у кота: ${amountDislikes + m}`)
        })
    })
})