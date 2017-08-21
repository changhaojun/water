package com.finfosoft.water.desktop;

import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;

public class DesktopController extends Controller{
	@Clear
	public void index(){
		render("desktop.html");
	}

}
