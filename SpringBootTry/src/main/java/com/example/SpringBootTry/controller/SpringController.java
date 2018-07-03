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
	
	/**
	 * 测试直接返回数据和对象注入
	 * @return
	 */
	@RequestMapping(value="/a" ,method = RequestMethod.GET)
	public @ResponseBody String aa(){

		System.out.println(p.getAge());
		return "fighting";
	}
	
	/**
	 * 测试直接返回string。若页面有需要加载的参数，则报错
	 * @return
	 */
	@RequestMapping(value="/b",method = RequestMethod.GET)
	public String index(){
		System.out.println("bbbbbb");
		return "testPage";
	}
	
	/**
	 * 测试路径匹配
	 * @param name
	 * @return
	 */
	@RequestMapping(value="/c/{name}")
	public @ResponseBody String c(@PathVariable("name")String name){
		return name;
	}
	
	/**
	 * 测试modeAndView
	 * @return
	 */
	@RequestMapping(value="/d")
	public ModelAndView d(){
		System.out.println("dddddddddddd");
		ModelAndView mav = new ModelAndView();
		mav.setViewName("testFunction");
		mav.addObject("NAME", "WWL");
		return mav;
	}
	
	/**
	 * 测试get，字符串类型参数装载
	 * @param name
	 * @return
	 */
	@RequestMapping(value="/e")
	public @ResponseBody String e(String name){
		System.out.println("eeeeeeeeee");
		String returnStr = null ;
		if(name == null){
			returnStr = "请在url上传入name属性对应的值！";
		}else{
			returnStr = name + "get测试成功！";
		}
		return returnStr;
	}
	
	/**
	 * @param hm
	 * @return
	 * 测试post，json类型装载成map
	 */
	@RequestMapping(value="/f")
	public @ResponseBody String f(People p){
		System.out.println("fffffffff:" + p.getAge());
		return p.getAge() + "post测试成功！";
	}

}
