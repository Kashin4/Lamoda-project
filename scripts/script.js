/*jshint esversion: 6 */
const headerCityButton  = document.querySelector('.header__city-button');

let hash = location.hash.substring(1);




const updateLocation = () => {
    const lsLocation = localStorage.getItem('lomoda-location');
    
    headerCityButton.textContent = 
    lsLocation && lsLocation !== 
    'null' ? 
        lsLocation : 
        'Ваш город?';
};

headerCityButton.addEventListener ('click', () => {
    const city = prompt('Укажите ваш город');
    if (city !== null) {
        localStorage.setItem('lomoda-location', city);
    }
    
    updateLocation();
});

    updateLocation();
// блокировка скрола

const disableScroll = () => {
    const widthScrll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
        position: fixed;
        top:${-window.scrollY}px;
        left:0;
        width:100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScrll}px;
    `;
};

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY
    });
};


// модальное окно

const subheaderCart = document.querySelector ('.subheader__cart');
const cartOverlay = document.querySelector ('.cart-overlay');
const cartBtnClose = document.querySelector ('.cart__btn-close');

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
};


//== запрос базы данных ==


const getData = async (server) => {
    const data = await fetch(server);
    
    if(data.ok) {
        return data.json();
    } else{
        throw new Error(`Данные небыли получены, ошибка ${data.status} ${data.statusText}`);
    }

};

const getGoods = (callback, value) => {
    getData('db.json')
        .then(data => {
            if(value){
                callback(data.filter(item => item.category === value));
            } else {
                callback(data);
            }
        }) 
        .catch(err => {
        console.error(err);
        });
};


//== events==
subheaderCart.addEventListener('click', cartModalOpen );

cartOverlay.addEventListener('click', (event) => {
    const target = event.target;

    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose();
    }
});

// ==============
    try {
        const goodsList = document.querySelector('.goods__list');
        if (!goodsList) {
            throw 'This is not a goods pages';
        }

        const createCard = ({id,preview, cost, brand, name, sizes}) => {
         
            
            const li = document.createElement('li');

           

            li.classList.add('goods__item');

            li.innerHTML = `
                <article class="good">
                    <a class="good__link-img" href="card-good.html#${id}">
                        <img class="good__img" src="goods-image/${preview}" alt="">
                    </a>
                    <div class="good__description">
                        <p class="good__price">${cost} &#8381;</p>
                        <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                        ${sizes ? 
                            `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>`: 
                            ''}
                        <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                    </div>
                </article>
            `;

            return li;
        };

        const renderGoodsList = data => {
            goodsList.textContent = '';
              

            data.forEach((item) => {
                const card = createCard(item);
                goodsList.append(card);
            });
        };

        window.addEventListener('hashchange', () => {

            hash = location.hash.substring(1);
            getGoods(renderGoodsList, hash);

        });

        getGoods(renderGoodsList, hash);

    } catch (err) {
        console.warn(err);
    }