package com.example.SpringBootTry.bean;

import org.springframework.stereotype.Repository;

@Repository(value="peopleT")
public class People {
	private int age = 340;
	public int getAge(){
		return this.age;
	}
	public void setAge(int age){
		this.age = age;
	}
}
