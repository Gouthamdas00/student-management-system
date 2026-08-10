package com.example.demo.services;
import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.UserPrinciple;
import com.example.demo.model.Users;
import com.example.demo.repository.UserRepo;

@Service
public class MyUserDetailService implements UserDetailsService {
    private final UserRepo repo;

    MyUserDetailService(UserRepo repo) {
        this.repo = repo;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Users user= repo.findByUsername(username);
        if (user == null) {
            System.out.println("User not found with username: " + username);
            throw new UsernameNotFoundException("User not found");
        }
        return new UserPrinciple(user); 
    }
}
