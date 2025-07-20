// PowerSwitch.jsx
export default function PowerSwitch({ isOn, onToggle }) {
  return (
    <h1
      onClick={onToggle}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isOn ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <h1
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </h1>
  );
}
