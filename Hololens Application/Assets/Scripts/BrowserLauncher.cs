using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BrowserLauncher : MonoBehaviour
{
    public GameObject IP;
    AddressScript IPscript;
    // Start is called before the first frame update
    void Start()
    {
        IPscript = IP.GetComponent<AddressScript>();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void Click()
    {
        string url = "https://" + IPscript.address + ":8443/engiee/";
        Application.OpenURL(url);
    }
}
