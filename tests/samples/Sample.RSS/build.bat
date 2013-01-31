@echo off
echo INFO: building application
call titanium build --platform=tizen
echo INFO: uninstalling old application
call web-uninstall -i http://appcelerator.com
echo INFO: Installing application to emulator
call c:\tizen-sdk\tools\ide\bin\web-run.bat -w build\tizen\tizenapp.wgt -i http://appcelerator.com