'use strict'
/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    seconds = 1000;
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, seconds);
    });
}


/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    return new Promise(function (resolve, reject) {
        fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
            .then(response => {
                if (response.ok) {
                    return Promise.resolve(response)
                } else {
                    return Promise.reject( new Error((response.statusText)))
                }
            })
            .then(response => response.json())
            .then(towns => {
                let sortTowns = towns.sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    } else if (a.name < b.name){
                        return -1;
                    } else {return 0}

                });
                return  resolve(sortTowns)
            })
            .catch(function (error) {
                reject(error)
                console.log("no")
            });

    })

}


export {
    delayPromise,
    loadAndSortTowns
};
