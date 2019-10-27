'use strict';

var NUMER_MIN_AVATAR = 1;
var NUMER_MAX_AVATAR = 6;
var NUMER_MIN_PHOTOS = 1;
var AMOUNT_PHOTOS = 25;
var MAX_LIKES = 200;
var MIN_LIKES = 15;
var MIN_COMMENTS = 0;
var MAX_COMMENTS = 10;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var DEFAULT_SCALE_VALUE = 100;
var MAX_HASH_LENGTH = 20;
var MAX_HASH_AMOUNT = 5;
var MAX_FILTER_VALUE = 100;
var MIN_FILTER_VALUE = 0;
var MIN_SCALE_VALUE = 25;
var MAX_SCALE_VALUE = 100;
var STEP_SCALE_VALUE = 25;
var messageHeshAlert = [
  'Количество хеш-тегов не может быть больше 5',
  'Хэш-тэг не может состоять только из одной решётки',
  'Хэш-тэг должен начинаться с символа #',
  'Хэш-теги разделяются пробелами',
  'Хэш-тэг не может содержать больше 20 символов, включая #',
  'Один и тот же хэш-тег не может быть использован дважды'];
var effectNames = ['chrome', 'sepia', 'marvin', 'phobos', 'heat', 'none'];
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
// задание 4.8
var uploadForm = document.querySelector('.img-upload__form');
var uploadFormElements = {
  uploadFile: uploadForm.querySelector('#upload-file'),
  editWindow: uploadForm.querySelector('.img-upload__overlay'),
  closeButton: uploadForm.querySelector('.img-upload__cancel'),
  hashtagsInput: uploadForm.querySelector('.text__hashtags'),
  descriptionTextarea: uploadForm.querySelector('.text__description'),
  scaleControlSmaller: uploadForm.querySelector('.scale__control--smaller'),
  scaleControlValue: uploadForm.querySelector('.scale__control--value'),
  scaleControlBigger: uploadForm.querySelector('.scale__control--bigger'),
  slideOfEffectLevel: uploadForm.querySelector('.img-upload__effect-level')
};
var scaleValue = DEFAULT_SCALE_VALUE;

var imgUploadPreview = uploadForm.querySelector('.img-upload__preview');
var imgPreview = imgUploadPreview.querySelector('img');
var imgUploadEffects = uploadForm.querySelector('.img-upload__effects');
var currentEffect = 'none';

var controlsEffect = {
  valueInput: uploadFormElements.slideOfEffectLevel.querySelector('.effect-level__value'),
  pinContainer: uploadForm.querySelector('.img-upload__preview-container'),
  pinLine: uploadForm.querySelector('.effect-level'),
  pin: uploadFormElements.slideOfEffectLevel.querySelector('.effect-level__pin'),
  line: uploadForm.querySelector('.effect-level__line'),
  effectLine: uploadForm.querySelector('.effect-level__depth')
};

var setSizePreviewImg = function () {
  uploadFormElements.scaleControlValue.value = scaleValue + '%';
  imgPreview.style.transform = 'scale(' + scaleValue / 100 + ')';
};

var editWindowCloseClickHandler = function () {
  uploadFormElements.editWindow.classList.add('hidden');

  uploadFormElements.uploadFile.value = null;
  imgPreview.style.filter = 'none';
  scaleValue = DEFAULT_SCALE_VALUE;

  setSizePreviewImg();
  removeEventHandler();
};

var editWindowEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && evt.target !== uploadFormElements.hashtagsInput && evt.target !== uploadFormElements.descriptionTextarea) {
    editWindowCloseClickHandler();
  }
};

var editWindowCloseEnterHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    editWindowCloseClickHandler();
  }
};

var removeEventHandler = function () {
  uploadFormElements.closeButton.removeEventListener('click', editWindowCloseClickHandler);
  uploadFormElements.closeButton.removeEventListener('keydown', editWindowCloseEnterHandler);
  document.removeEventListener('keydown', editWindowEscHandler);
  uploadForm.removeEventListener('click', changeScaleImgClickHandler);
  uploadForm.removeEventListener('keydown', changeScaleImgEnterHandler);
  controlsEffect.pin.removeEventListener('mousedown', ChangeDepthEffect);
  uploadFormElements.hashtagsInput.removeEventListener('input', getHashValidity);
};

var addEventHandler = function () {
  uploadFormElements.closeButton.addEventListener('click', editWindowCloseClickHandler);
  uploadFormElements.closeButton.addEventListener('keydown', editWindowCloseEnterHandler);

  document.addEventListener('keydown', editWindowEscHandler);

  uploadForm.addEventListener('click', changeScaleImgClickHandler);
  uploadForm.addEventListener('keydown', changeScaleImgEnterHandler);

  controlsEffect.pin.addEventListener('mousedown', ChangeDepthEffect);

  uploadFormElements.hashtagsInput.addEventListener('input', getHashValidity);

  imgUploadEffects.addEventListener('change', selectEffect);
};

var selectEffect = function (evt) {
  var target = evt.target;
  var effectsValue = imgPreview.classList;

  if (effectsValue.length > 0) {
    imgPreview.classList.remove(effectsValue);
  }

  if (target.value !== 'none') {
    editEffect(target.value);
  } else if (target.value === 'none') {
    uploadFormElements.slideOfEffectLevel.classList.add('hidden');
  }

  currentEffect = target.value;
  setEffectValue(target.value, controlsEffect.valueInput.value);
};

uploadFormElements.uploadFile.addEventListener('change', function () {
  uploadFormElements.editWindow.classList.remove('hidden');
  uploadFormElements.scaleControlValue.value = DEFAULT_SCALE_VALUE + '%';
  uploadFormElements.slideOfEffectLevel.classList.add('hidden');

  var effectsValue = imgPreview.classList;

  if (effectsValue.length > 0) {
    imgPreview.classList.remove(effectsValue);
  }

  addEventHandler();
});

var changeScaleImgClickHandler = function (evt) {
  scaleValue = parseInt(uploadFormElements.scaleControlValue.value, 10);

  var target = evt.target;
  if (target === uploadFormElements.scaleControlSmaller) {
    scaleValue = (scaleValue - STEP_SCALE_VALUE > MIN_SCALE_VALUE) ? scaleValue - STEP_SCALE_VALUE : MIN_SCALE_VALUE;
  }

  if (target === uploadFormElements.scaleControlBigger) {
    scaleValue = (scaleValue + STEP_SCALE_VALUE < MAX_SCALE_VALUE) ? scaleValue + STEP_SCALE_VALUE : MAX_SCALE_VALUE;
  }

  setSizePreviewImg();
};

var changeScaleImgEnterHandler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    changeScaleImgClickHandler();
  }
};

var editEffect = function (val) {
  var effectClass = 'effects__preview--' + val;

  imgPreview.classList.add(effectClass);

  controlsEffect.valueInput.value = 100;
  controlsEffect.pin.style.left = controlsEffect.valueInput.value + '%';
  controlsEffect.effectLine.style.width = controlsEffect.valueInput.value + '%';

  uploadFormElements.slideOfEffectLevel.classList.remove('hidden');
};

var setEffectValue = function (effectName, value) {
  var propertyEffect = 'none';
  switch (effectName) {
    case effectNames[0]:
      value = value / 100;
      propertyEffect = 'grayscale(' + value + ')';
      break;
    case effectNames[1]:
      value = value / 100;
      propertyEffect = 'sepia(' + value + ')';
      break;
    case effectNames[2]:
      propertyEffect = 'invert(' + value + '%)';
      break;
    case effectNames[3]:
      value = 3 * value / 100;
      propertyEffect = 'blur(' + value + 'px)';
      break;
    case effectNames[4]:
      value = 2 * value / 100 + 1;
      propertyEffect = 'brightness(' + value + ')';
      break;
    case effectNames[5]:
      value = 100;
      propertyEffect = 'none';
      break;

    default: break;
  }
  imgPreview.style.filter = propertyEffect;
};

var getCoords = function (element, evt) {
  var rect = element.getBoundingClientRect();

  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

var ChangeDepthEffect = function (evt) {
  evt.preventDefault();
  var target = evt.target;
  var shifts = getCoords(target, evt);

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    var coords = getCoords(controlsEffect.line, moveEvt);
    var value = Math.ceil((coords.x + target.offsetWidth / 2 - shifts.x) / controlsEffect.line.offsetWidth * 100);

    if (value < MIN_FILTER_VALUE) {
      value = MIN_FILTER_VALUE;
    }
    if (value > MAX_FILTER_VALUE) {
      value = MAX_FILTER_VALUE;
    }
    controlsEffect.pin.style.left = value + '%';
    controlsEffect.effectLine.style.width = value + '%';
    controlsEffect.valueInput.setAttribute('value', value);
    setEffectValue(currentEffect, value);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

var getHashValidity = function (evt) {
  var target = evt.target;
  var hash = target.value;
  hash = hash.toUpperCase();
  var tags = hash.split(' ');

  if (tags.length > MAX_HASH_AMOUNT) {
    target.setCustomValidity(messageHeshAlert[0]);
  } else {
    for (i = 0; i < tags.length; i++) {
      if (tags[i] === '#') {
        target.setCustomValidity(messageHeshAlert[1]);
        break;
      } else if (tags[i].indexOf('#', 0)) {
        target.setCustomValidity(messageHeshAlert[2]);
        break;
      } else if (tags[i].indexOf('#', 0) !== tags[i].lastIndexOf('#', tags[i].length)) {
        target.setCustomValidity(messageHeshAlert[3]);
        break;
      } else if (tags[i].length > MAX_HASH_LENGTH) {
        target.setCustomValidity(messageHeshAlert[4]);
        break;
      } else if (tags.indexOf(tags[i], i + 1) !== -1 && i < tags.length || tags.lastIndexOf(tags[i], i - 1) !== -1 && i > 0) {
        target.setCustomValidity(messageHeshAlert[5]);
        break;
      } else {
        target.setCustomValidity('');
      }
    }
  }
};
