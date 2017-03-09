package login;

import org.apache.log4j.Logger;

import com.jfinal.core.Controller;
import com.jfinal.validate.Validator;

public class LoginValidator extends Validator{
	Logger logger=Logger.getLogger(LoginValidator.class); 

	@Override
	protected void validate(Controller c) {
		// TODO Auto-generated method stub
		String username=c.getPara("username");
		String password=c.getPara("password");
		validateAccount(username,password);
		
	}

	@Override
	protected void handleError(Controller c) {
		// TODO Auto-generated method stub
		c.keepPara("username");
		c.render("login.html");
		
	}
	
	private void validateAccount(String username,String password){
		LoginService loginservice=new LoginService();
		boolean valid=loginservice.checkLogin(username, password);
		if(!valid){
			addError("accountMsg","账号或密码错误");
		}
	}

}
