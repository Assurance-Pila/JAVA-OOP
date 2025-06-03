package employee.management.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Home extends JFrame implements ActionListener{

    JButton view, add, update, remove;
    
    Home() {
        
        setLayout(null);
        
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("icons/home.jpg"));
        Image i2 = i1.getImage().getScaledInstance(1320, 730, Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel image = new JLabel(i3);
        image.setBounds(0, 0, 1120, 630);
        add(image);
        
        JLabel heading = new JLabel("Staff Management System");
        heading.setBounds(220, 20, 400, 40);
        heading.setFont(new Font("Raleway", Font.BOLD, 50));
        image.add(heading);
        
        
        
      int frameWidth = 1120; // JFrame width
int buttonWidth = 300; // Double original size
int buttonHeight = 80;

// Calculate center position
int xCenter = (frameWidth - buttonWidth) / 2;

add = new JButton("Add Employee");
add.setBounds(xCenter, 120, buttonWidth, buttonHeight);
add.addActionListener(this);
image.add(add);

view = new JButton("View Employees");
view.setBounds(xCenter, 220, buttonWidth, buttonHeight);
view.addActionListener(this);
image.add(view);

update = new JButton("Update Employee");
update.setBounds(xCenter, 320, buttonWidth, buttonHeight);
update.addActionListener(this);
image.add(update);

remove = new JButton("Remove Employee");
remove.setBounds(xCenter, 420, buttonWidth, buttonHeight);
remove.addActionListener(this);
image.add(remove);

setSize(frameWidth, 630);
setLocation(250, 100);

add.setFont(new Font("Arial", Font.BOLD, 20)); // Set font size to 20
view.setFont(new Font("Arial", Font.BOLD, 20));
update.setFont(new Font("Arial", Font.BOLD, 20));
remove.setFont(new Font("Arial", Font.BOLD, 20));

        setVisible(true);
    }
    
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == add) {
            setVisible(false);
            new AddEmployee();
        } else if (ae.getSource() == view) {
            setVisible(false);
            new ViewEmployee();
        } else if (ae.getSource() == update) {
            setVisible(false);
            new ViewEmployee();
        } else {
            setVisible(false);
            new RemoveEmployee();
        }
    }

    public static void main(String[] args) {
        new Home();
    }
}
