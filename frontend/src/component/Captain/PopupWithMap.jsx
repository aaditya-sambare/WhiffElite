import { useRef, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { MapPin, X, Navigation } from "lucide-react";

export default function PopupWithMap({
  isOpen,
  onClose,
  pickupLat,
  pickupLng,
  destinationLat,
  destinationLng,
  pickupAddress,
  destinationAddress,
}) {
  const popupRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - (popupRef.current?.offsetLeft || 0),
      y: e.clientY - (popupRef.current?.offsetTop || 0),
    });
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    if (popupRef.current) {
      popupRef.current.style.left = `${e.clientX - dragOffset.x}px`;
      popupRef.current.style.top = `${e.clientY - dragOffset.y}px`;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  const handleTouchStart = (e) => {
    if (!e.touches.length) return;
    setDragging(true);
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - (popupRef.current?.offsetLeft || 0),
      y: touch.clientY - (popupRef.current?.offsetTop || 0),
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging || !e.touches.length) return;
    const touch = e.touches[0];
    if (popupRef.current) {
      popupRef.current.style.left = `${touch.clientX - dragOffset.x}px`;
      popupRef.current.style.top = `${touch.clientY - dragOffset.y}px`;
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.onmousemove = dragging ? handleMouseMove : null;
    window.onmouseup = dragging ? handleMouseUp : null;

    window.ontouchmove = dragging ? handleTouchMove : null;
    window.ontouchend = dragging ? handleTouchEnd : null;

    return () => {
      window.onmousemove = null;
      window.onmouseup = null;
      window.ontouchmove = null;
      window.ontouchend = null;
    };
  }, [dragging]);

  const directionUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${pickupLat},${pickupLng}&destination=${destinationLat},${destinationLng}&mode=driving&maptype=roadmap`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <Dialog.Panel
        ref={popupRef}
        className="absolute bg-white rounded-2xl p-4 shadow-lg w-[90%] sm:max-w-md max-h-[90vh] overflow-auto"
        style={{
          left: "50%",
          top: "10%",
          transform: "translate(-50%, 0)",
          cursor: dragging ? "move" : "default",
        }}
      >
        <div
          className="flex justify-between items-center mb-3 cursor-move touch-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-500" />
            Ride Directions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-3 space-y-1 text-sm sm:text-base">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
            <div>
              <span className="font-medium">Pickup:</span>{" "}
              {pickupAddress || `${pickupLat}, ${pickupLng}`}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <span className="font-medium">Destination:</span>{" "}
              {destinationAddress || `${destinationLat}, ${destinationLng}`}
            </div>
          </div>
        </div>

        <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-4">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            src={mapEmbedUrl}
          ></iframe>
        </div>

        <a
          href={directionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Open in Google Maps
        </a>
      </Dialog.Panel>
    </Dialog>
  );
}
