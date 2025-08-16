package co.edu.sena.arkosystem.viewController;

import co.edu.sena.arkosystem.model.Suppliers;
import co.edu.sena.arkosystem.repository.RepositorySuppliers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/view/suppliers")
public class ViewSuppliers {

    @Autowired
    private RepositorySuppliers supplierRepository;

    @GetMapping
    public String list(@org.springframework.web.bind.annotation.RequestParam(name = "search", required = false) String search, Model model) {
        if (search != null && !search.isEmpty()) {
            model.addAttribute("suppliers", supplierRepository.findByNameContainingIgnoreCase(search));
        } else {
            model.addAttribute("suppliers", supplierRepository.findAll());
        }
        model.addAttribute("search", search);
        return "ViewsSuppliers/Suppliers";
    }

    @GetMapping("/form")
    public String form(@RequestParam(required = false) Long id, Model model) {
        if (id != null) {
            Suppliers supplier = supplierRepository.findById(id).orElse(new Suppliers());
            model.addAttribute("supplier", supplier);
        } else {
            model.addAttribute("supplier", new Suppliers());
        }
        return "ViewsSuppliers/Suppliers_form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Suppliers supplier) {
        supplierRepository.save(supplier);
        return "redirect:/view/suppliers";
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        Suppliers supplier = supplierRepository.findById(id).orElse(new Suppliers());
        model.addAttribute("supplier", supplier);
        return "ViewsSuppliers/Suppliers_form";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        supplierRepository.deleteById(id);
        return "redirect:/view/suppliers";
    }
}
