'use strict';

var NUMER_MIN_AVATAR = 1;
var NUMER_MAX_AVATAR = 6;
var NUMER_MIN_PHOTOS = 1;
var AMOUNT_PHOTOS = 25;
var MAX_LIKES = 200;
var MIN_LIKES = 15;
var MIN_COMMENTS = 0;
var MAX_COMMENTS = 10;

var messages = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var names = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var descriptions = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var photos = [];
var listComments = [];
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var setupPictures = document.querySelector('.pictures');

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getPhotos = function (numer) {
  photos[numer] = {
    url: 'photos/' + (numer + 1) + '.jpg',
    description: descriptions[getRandomInt(NUMER_MIN_PHOTOS, descriptions.length) - 1],
    likes: getRandomInt(MIN_LIKES, MAX_LIKES),
    comments: getCommentsFunc(getRandomInt(MIN_COMMENTS, MAX_COMMENTS))
  };

  return photos[numer];
};

var getComments = function (numer) {
  listComments[numer] = {
    avatar: 'img/avatar-' + getRandomInt(NUMER_MIN_AVATAR, NUMER_MAX_AVATAR) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)],
    name: names[getRandomInt(0, names.length - 1)]
  };

  return listComments[numer];
};

var getCommentsFunc = function (random) {
  listComments = [];
  for (var j = 0; j < random; j++) {
    listComments.push(getComments(j));
  }
  listComments.pop();

  return listComments;
};

for (var i = 0; i < AMOUNT_PHOTOS; i++) {
  photos.push(getPhotos(i));
}
photos.pop();

var renderPicture = function (elem) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = elem.url;
  pictureElement.querySelector('.picture__likes').textContent = elem.likes;
  pictureElement.querySelector('.picture__comments').textContent = elem.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

photos.forEach(function (elem) {
  fragment.appendChild(renderPicture(elem));
});

setupPictures.appendChild(fragment);
