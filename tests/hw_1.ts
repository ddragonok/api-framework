import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';


describe('Проверка функционала удаления кота', async() => {
    it('Удаление случайного кота', async () => {
        console.info('Тест: Удаление случайного кота')
        const getRandomInt = (max: number) => Math.floor(Math.random() * max)
        const idRandomCat = await allure.step(`Получение случайного кота`, async () => {
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

        await allure.step(`Удаление этого кота`, async () => {
            console.info('Удаляем найденного кота. Выполняется запрос DELETE /remove');
            const responseRemoveCat = await CoreApi.removeCat(idRandomCat)
            const randomCat = JSON.stringify(responseRemoveCat.data, null, 2);
            console.info('Получен ответ на запрос DELETE /remote\nУдаленный кот:\n', randomCat);
            allure.attachment('Удаленный кот', randomCat, 'application/json');
        });

        await allure.step(`Проверка, что кота, которого искали, больше нет`, async () => {
            const status: number = 404
            console.info('Еще раз пробуем удалить найденного кота. Выполняется запрос DELETE /remove')
            const responseRemoveCat = await CoreApi.removeCat(idRandomCat)
            const randomCat = JSON.stringify(responseRemoveCat.data, null, 2)
            console.info('Получен ответ на запрос DELETE /remote\n', randomCat)
            allure.attachment('Ответ запроса DELETE /remove', randomCat, 'application/json')
            assert.ok(status === responseRemoveCat.status, 'Получен неверный статус!')
            console.info(`Проверили, что найденного кота больше нет, запрос вернул ответ: ${responseRemoveCat.status}, ${responseRemoveCat.statusText}`)
        })

    })
})
