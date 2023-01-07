using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BrowserLauncher : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void Click()
    {
        Application.OpenURL("https://192.168.18.6:8443/engiee/");
    }
}
