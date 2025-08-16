package co.edu.sena.arkosystem.viewController;

import co.edu.sena.arkosystem.model.Employee;
import co.edu.sena.arkosystem.repository.RepositoryEmployee;
import co.edu.sena.arkosystem.repository.RepositoryRole;
import co.edu.sena.arkosystem.repository.RepositoryUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ViewEmployee {
    @Autowired
    RepositoryEmployee employeeRepository;

    @Autowired
    RepositoryRole roleRepository;

    @Autowired
    RepositoryUser userRepository;
    @GetMapping("/view/employee")
    public String list(@org.springframework.web.bind.annotation.RequestParam(name = "search", required = false) String search, Model model) {
        model.addAttribute("activePage", "employee");
        if (search != null && !search.isEmpty()) {
            model.addAttribute("employees", employeeRepository.findByNameContainingIgnoreCase(search));
        } else {
            model.addAttribute("employees", employeeRepository.findAll());
        }
        model.addAttribute("search", search);
        return "ViewsEmployees/Employee";
    }

    @GetMapping("viewE/form")
    public String form(Model model) {
        model.addAttribute("activePage", "employee");
        model.addAttribute("employee", new Employee());
        model.addAttribute("role", roleRepository.findAll());
        model.addAttribute("user", userRepository.findAll());
        model.addAttribute("employees", employeeRepository.findAll());
        return "ViewsEmployees/employee_form";
    }

    @PostMapping("/viewE/save")
    public String save(@ModelAttribute Employee employee, RedirectAttributes ra) {
        employeeRepository.save(employee);
        ra.addFlashAttribute("success", "Empleado guardado correctamente");
        return "redirect:/view/employee";
    }

    @GetMapping("/viewE/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        model.addAttribute("activePage", "employee");
        model.addAttribute("employee", employee);
        model.addAttribute("role", roleRepository.findAll());
        model.addAttribute("user", userRepository.findAll());
        return "ViewsEmployees/employee_form";
    }

    @PostMapping("viewE/delete/{id}")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        employeeRepository.deleteById(id);
        ra.addFlashAttribute("success", "Empleado eliminado");
        return "redirect:/view/employee";
    }
}