package com.example.SpringBootTry.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class SpringController {
	
	@RequestMapping(value="/aa")
	public @ResponseBody String aa(){
		return "fighting";
	}
	
	@RequestMapping("/t")
	public @ResponseBody String t(){
		return "Hello World!!";
	}
}
