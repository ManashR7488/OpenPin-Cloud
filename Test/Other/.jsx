{
  sensors.map((f) => {
    const theme = themes[f.type] || themes.sensor;
    const liveVal = liveData[f.key] ?? f.value;
    const editing = editingId === f._id;
    return (
      <div
        key={f._id}
        className={`relative p-6 rounded-2xl shadow-lg overflow-hidden transition ${theme.accent}`}
      >
        {/* pulse circle + icon bg */}
        <div
          className={`absolute -top-5 -right-5 w-24 h-24 ${theme.pulse} rounded-full animate-pulse opacity-50 pointer-events-none`}
        />
        <div className="absolute h-full w-full top-0 left-0 flex justify-end overflow-hidden pointer-events-none">
          <div
            className={`w-32 h-32 ${theme.iconBg} rounded-full flex items-center justify-center opacity-20`}
          >
            {icons[f.type]}
          </div>
        </div>
        {editing ? (
          <>
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm((d) => ({ ...d, name: e.target.value }))
              }
              className="w-full mb-2 px-3 py-2 border rounded-lg"
            />
            <select
              value={editForm.type}
              onChange={(e) =>
                setEditForm((d) => ({ ...d, type: e.target.value }))
              }
              className="w-full mb-4 px-3 py-2 border rounded-lg"
            >
              {Object.keys(themes).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleSave(f._id, f.key)}
                className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
              >
                <FiSave />
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
              >
                <FiX />
              </button>
            </div>
          </>
        ) : (
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between w-full gap-2 mb-4">
                  <div className="flex items-center gap-2 mb-4 ">
                    {icons[f.type]}
                    <h3 className="text-xl font-semibold">{f.name}</h3>
                  </div>
                  <div className="justify-self-end flex gap-2">
                    <button
                      onClick={() => startEdit(f)}
                      className={`p-1 ${theme.button} text-white rounded-full transition`}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(f._id)}
                      className="p-1 bg-red-400 hover:bg-red-500 text-white rounded-full transition"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <div className="text-4xl font-bold">
                    {liveVal != null ? liveVal : "--"}
                    <span className="text-lg font-normal ml-2">{f.unit}</span>
                  </div>
                  <div className="w-full">
                    <button onClick={() => toggleGraph(f.key)}>
                      Show Chart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });
}

{
  controls.map((f) => {
    const theme = themes[f.type] || themes.sensor;
    const liveVal = liveData[f.key] ?? f.value;
    const editing = editingId === f._id;
    return (
      <div
        key={f._id}
        className={`relative flex items-center justify-between p-4 rounded-xl shadow-lg overflow-hidden transition ${theme.accent}`}
      >
        <div className="flex items-center gap-3 z-1">
          {f.type === "fan" && liveVal ? (
            <span className="animate-spin">{icons[f.type]}</span>
          ) : f.type === "light" && liveVal ? (
            <span className="relative">
              <span className="absolute flex size-5 top-0 left-1/2 -translate-x-1/2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-80"></span>
                <span className="relative inline-flex size-3 rounded-full"></span>
              </span>
              <span className="text-yellow-500 ">{icons[f.type]}</span>
            </span>
          ) : f.type === "switch" && liveVal ? (
            <span className="animate-spin">{icons[f.type]}</span>
          ) : f.type === "light" && liveVal ? (
            <span className="animate-spin">{icons[f.type]}</span>
          ) : (
            <span>{icons[f.type]}</span>
          )}
          <span className="font-medium">{f.name}</span>
        </div>
        <PowerSwitch
          isOn={!!liveVal}
          theme={theme}
          onToggle={(nv) => handleToggle(f.key, nv)}
        />
      </div>
    );
  });
}
