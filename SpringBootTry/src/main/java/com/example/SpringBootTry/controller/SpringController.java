package com.example.SpringBootTry.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SpringController {
	
	@RequestMapping(value="/a")
	public @ResponseBody String aa(){
		System.out.println("aaaaaa");
		return "fighting";
	}
	
	@RequestMapping(value="/b",method = RequestMethod.GET)
	public ModelAndView index(){
		System.out.println("bbbbbb");
		return new ModelAndView("index");
	}
	
	@RequestMapping(value="/c")
	public @ResponseBody String c(){
		System.out.println("ccccc");
		return "Hello World!!";
	}
	

}
