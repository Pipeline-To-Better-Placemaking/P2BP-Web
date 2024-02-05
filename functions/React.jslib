mergeInto(LibraryManager.library, {
  ReceiveProgramData: function (programJSON) {
    try {
      window.dispatchReactUnityEvent(
        "ReceiveProgramData",
        UTF8ToString(programJSON)
      );
    } catch (e) {
      console.warn("Failed to dispatch surveyor identifying program event");
    }
  },
  AdminButtons: function (isContinue) {
    try {
      window.dispatchReactUnityEvent("AdminButtons", isContinue);
    } catch (e) {
      console.warn("Failed to dispatch admin identifying program event");
    }
  },
});
