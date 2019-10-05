'use strict';

var messages = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var photoDescriptions = [];
var listComments = [];
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var setupPictures = document.querySelector('.pictures');

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

for (var i = 0; i < 25; i++) {
  photoDescriptions[i] = {
    url: 'photos/' + (i + 1) + '.jpg',
    description: '',
    likes: getRandomInt(15, 200),
    comments: listComments
  };
}

for (var j = 0; j < 6; j++) {
  listComments[j] = {
    avatar: 'img/avatar-' + getRandomInt(0, 5) + '.svg',
    message: messages[getRandomInt(0, 5)],
    name: ''
  };
}

var renderPicture = function (elem) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = elem.url;
  pictureElement.querySelector('.picture__likes').textContent = elem.likes;
  pictureElement.querySelector('.picture__comments').textContent = elem.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

for (j = 0; j < photoDescriptions.length; j++) {
  fragment.appendChild(renderPicture(photoDescriptions[j]));
}

setupPictures.appendChild(fragment);
