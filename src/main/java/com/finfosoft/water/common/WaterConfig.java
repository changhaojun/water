package com.finfosoft.water.common;

import com.finfosoft.db.mongo.MongodbPlugin;
import com.finfosoft.water.frame.FrameController;
import com.finfosoft.water.login.LoginController;
import com.finfosoft.water.user.UserController;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.kit.PropKit;
import com.jfinal.render.ViewType;

public class WaterConfig extends JFinalConfig{
	@Override
	public void configConstant(Constants me) {
		//PropKit.use("lanyue_config.txt");
		me.setDevMode(true);
		me.setViewType(ViewType.FREE_MARKER);
		me.setBaseViewPath("/page");
	}

	@Override
	public void configRoute(Routes me) {
		// TODO Auto-generated method stub
		me.add("/", LoginController.class);                        //登录页面
		me.add("/frame",FrameController.class,"/");                //框架页面
		me.add("/user",UserController.class,"/");                //框架页面
		
	}

	@Override
	public void configPlugin(Plugins me) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void configInterceptor(Interceptors me) {
		// TODO Auto-generated method stub
		me.add(new AuthInterceptor());
		me.add(new GlobalAttrInterceptor());
		
	}

	@Override
	public void configHandler(Handlers me) {
		// TODO Auto-generated method stub
		
	}
	public static void main(String[] args) {
		JFinal.start("src/main/webapp", 8080, "/finfosoft-water", 5);
	}
}
