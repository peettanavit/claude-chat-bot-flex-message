const KEYWORDS = new Map([
  ['แนะนำอาหาร', 'recommend'],
  ['กินอะไรดี', 'whatToEat'],
  ['หิวข้าว', 'hungry']
]);


const FALLBACK_MENUS = {
  recommend: [
    {
      name: 'ข้าวผัดกุ้ง',
      image: '/images/ข้าวผัดกุ้ง.jpg',
      calories: 590,
      protein: 23
    },
    {
      name: 'ผัดไทย',
      image: '/images/ผัดไทย.jpg',
      calories: 650,
      protein: 22
    },
    {
      name: 'ต้มยำกุ้ง',
      image: '/images/ต้มยำกุ้ง.jpg',
      calories: 300,
      protein: 18
    },
    {
      name: 'แกงเขียวหวานไก่',
      image: '/images/แกงเขียวหวานไก่.jpg',
      calories: 600,
      protein: 25
    },
    {
      name: 'ข้าวซอยไก่',
      image: '/images/ข้าวซอยไก่.jpg',
      calories: 720,
      protein: 28
    },
    {
      name: 'ลาบหมู',
      image: '/images/ลาบหมู.jpg',
      calories: 350,
      protein: 26
    },
    {
      name: 'ส้มตำไทย',
      image: '/images/ส้มตำไทย.jpg',
      calories: 160,
      protein: 3
    },
    {
      name: 'ข้าวขาหมู',
      image: '/images/ข้าวขาหมู.jpg',
      calories: 800,
      protein: 28
    }
  ],
  whatToEat: [
    {
      name: 'ข้าวมันไก่',
      image: '/images/ข้าวมันไก่.jpg',
      calories: 650,
      protein: 26
    },
    {
      name: 'กะเพราไก่ไข่ดาว',
      image: '/images/กะเพราไก่ไข่ดาว.jpg',
      calories: 780,
      protein: 32
    },
    {
      name: 'สุกี้น้ำ',
      image: '/images/สุกี้น้ำ.jpg',
      calories: 360,
      protein: 20
    },
    {
      name: 'แกงจืดเต้าหู้หมูสับ',
      image: '/images/แกงจืดเต้าหู้หมูสับ.jpg',
      calories: 220,
      protein: 16
    },
    {
      name: 'ข้าวคลุกกะปิ',
      image: '/images/ข้าวคลุกกะปิ.jpg',
      calories: 680,
      protein: 20
    },
    {
      name: 'ขนมจีนน้ำยา',
      image: '/images/ขนมจีนน้ำยา.jpg',
      calories: 520,
      protein: 17
    },
    {
      name: 'ผัดซีอิ๊วหมู',
      image: '/images/ผัดซีอิ๊วหมู.jpg',
      calories: 760,
      protein: 27
    },
    {
      name: 'ยำวุ้นเส้น',
      image: '/images/ยำวุ้นเส้น.jpg',
      calories: 280,
      protein: 14
    }
  ],
  hungry: [
    {
      name: 'ข้าวหมูแดง',
      image: '/images/ข้าวหมูแดง.jpg',
      calories: 720,
      protein: 28
    },
    {
      name: 'ข้าวหน้าเนื้อ',
      image: '/images/ข้าวหน้าเนื้อ.jpg',
      calories: 780,
      protein: 30
    },
    {
      name: 'ราเมน',
      image: '/images/ราเมน.jpg',
      calories: 760,
      protein: 27
    },
    {
      name: 'ข้าวกะเพราหมูกรอบ',
      image: '/images/ข้าวกะเพราหมูกรอบ.jpg',
      calories: 900,
      protein: 30
    },
    {
      name: 'ก๋วยเตี๋ยวเรือ',
      image: '/images/ก๋วยเตี๋ยวเรือ.jpg',
      calories: 430,
      protein: 20
    },
    {
      name: 'ข้าวหน้าไก่',
      image: '/images/ข้าวหน้าไก่.jpg',
      calories: 650,
      protein: 25
    },
    {
      name: 'หมูกระทะ',
      image: '/images/หมูกระทะ.jpg',
      calories: 980,
      protein: 45
    },
    {
      name: 'ผัดกะเพราทะเล',
      image: '/images/ข้าวกระเพราทะเล.jpg',
      calories: 680,
      protein: 32
    }
  ]
};

module.exports = {
  KEYWORDS,
  FALLBACK_MENUS
};

