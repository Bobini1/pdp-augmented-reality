# pdp-augmented-reality
Professional Design Project at TUL

To open the screen, camera and audio sharing application, run pdp-augmented-reality\Desktop Application\apache-tomcat-9.0.68\bin\startup.bat,
open the browser and go to localhost:8080/engiee.

To modify the application, open part of the program you want to modify (e.g. pdp-augmented-reality\Desktop Application\EngieeCamera) as a project in
IDE (e.g. IntelliJ IDEA), apply your changes and generate WAR file. Paste generated WAR file to
pdp-augmented-reality\Desktop Application\apache-tomcat-9.0.68\webapps and give it a proper name (corresponding to the address of the part of the
program - # means /).

To run between two separate computers in local network using HTTPS instead of HTTP is required. To do so:
1. Generate .keystore file
a) open cmd and go to %JAVA_HOME%/bin
b) create .keystore file with a use of the following command:
keytool -genkey -alias tomcat -keyalg RSA
c) answer the questions and remember the password you set because it will be used in step 2
2. Configure server.xml
a) paste/update the following code block in server.xml (if you don't see the code, open README in raw or blame format):
<Connector SSLEnabled="true" acceptCount="100" clientAuth="false"
disableUploadTimeout="true" enableLookups="false" maxThreads="25"
port="8443" keystoreFile="C:/Users/your_username/.keystore" keystorePass="password_from_step1"
protocol="org.apache.coyote.http11.Http11NioProtocol" scheme="https"
secure="true" sslProtocol="TLS" />
b) replace your_username and password_from_step1 with correct data
c) run Tomcat again to apply the changes
d) you can run the application over https (port 8443 instead of 8080), ignore the risk message displayed
by the browser - the warning is displayed because for developing you have just generated a self-signed certificate
instead of a certificate from CA

Now the home webpage of the application is: https://localhost:8443/engiee

Of course, if a server is running on another computer, substitute localhost with IP address of this computer. 