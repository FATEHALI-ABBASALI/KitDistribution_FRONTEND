package com.kitdistribution.app;

import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ⭐ Keep WebView session persistent
        WebSettings settings = this.bridge.getWebView().getSettings();
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        // ⭐ Improve session stability
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
    }
}
