package com.itl.mwrbs.service;

import java.util.concurrent.atomic.AtomicBoolean;

public class GlobalConfig {

     // #region PROPERTIES
     private AtomicBoolean canContinue;
    // #endregion PROPERTIES
    
    private GlobalConfig() {
        canContinue = new AtomicBoolean();
    }
     
      // #region SINGLETON
    private static GlobalConfig _instance = null;

    static {
        _instance = _instance == null ? new GlobalConfig() : _instance;
    }

    public static GlobalConfig getInstance() {
        return _instance;
    }
    // #endregion SINGLETON

    public Boolean getCanContinue() {
        return canContinue.get();
    }

    public void setCanContinue(Boolean canContinue) {
        this.canContinue.set(canContinue);
    }


}