package com.example.SpringBootTry.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;

import com.example.SpringBootTry.bean.People;

@Controller
public class SpringController {	
	People p;


	@Resource(name="peopleT")
	public void setPeople(People p){
		this.p = p;
	}
	
	@RequestMapping(value="/a" ,method = RequestMethod.GET)
	public @ResponseBody String aa(){

		System.out.println(p.getAge());
		return "fighting";
	}
	
	@RequestMapping(value="/b",method = RequestMethod.GET)
	public String index(){
		System.out.println("bbbbbb");
		return "index";
	}
	
	@RequestMapping(value="/c/{name}")
	public @ResponseBody String c(@PathVariable("name")String name){
		return name;
	}
	
	@RequestMapping(value="/d")
	public ModelAndView d(){
		System.out.println("ddddddddddddjsp");
		ModelAndView mav = new ModelAndView();
		mav.setViewName("index");
		mav.addObject("NAME", "WWL");
		return mav;
	}

}
