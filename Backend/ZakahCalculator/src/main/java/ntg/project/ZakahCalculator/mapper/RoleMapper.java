package ntg.project.ZakahCalculator.mapper;

import ntg.project.ZakahCalculator.entity.Role;
import ntg.project.ZakahCalculator.entity.util.UserType;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public Role fromUserType(UserType userType) {
        if (userType == null) return null;
        Role role = new Role();
        role.setName(userType);
        return role;
    }

    public UserType toUserType(Role role) {
        if (role == null) return null;
        return role.getName();
    }
}
