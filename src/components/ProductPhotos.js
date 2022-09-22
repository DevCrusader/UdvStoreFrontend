import React, { useState, memo, useEffect } from "react";
import List from "../utils/List";

const _ProductPhotos = ({ photos = [] }) => {
  // Компонент отрисовывает фотографии, переданные от текущего выбранного товара на странице товара
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    if (photos && photos.length) setCurrentPhoto(0);
  }, [photos]);

  if (!photos.length) return <p>Photos list is empty</p>;
  return (
    <div className="photo-list">
      <img
        className="current-photo back-img-center"
        src={`https://artomdev.pythonanywhere.com/media/images/${photos[currentPhoto]}`}
        alt={`photo #${currentPhoto}`}
      />
      {photos ? (
        photos.length > 1 ? (
          <List
            data={photos}
            listClassName={"product-photo-list"}
            renderItem={(photo, index) => (
              <>
                <input
                  name="photo"
                  type="radio"
                  id={`photo-${index}`}
                  checked={index === currentPhoto}
                  onChange={() => setCurrentPhoto(index)}
                />
                <label htmlFor={`photo-${index}`}>
                  <img
                    src={`https://artomdev.pythonanywhere.com/media/images/${photo}`}
                    alt={`photo #${index}`}
                  />
                </label>
              </>
            )}
          />
        ) : (
          <div style={{ width: "78px" }}></div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

const ProductPhotos = memo(
  _ProductPhotos,
  (prev, next) => prev.photos == next.photos
);

export default ProductPhotos;
