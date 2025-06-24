**Project Proposal: Local Learning Management System (LLMS)**
======================================================

### Project Overview
The project proposes developing a Local Learning Management System (LLMS) tailored to the unique needs of African communities. This platform 
will be designed to meet the challenges facing African schools, focusing on offline accessibility and robust tracking of student progress. 
Additionally, after proper testing, we aim to explore partnerships with organizations such as World Possible and Enlight Africa to potentially 
integrate the LLMS into their existing educational devices and infrastructure.

### Content Management
The LLMS will not come with preloaded content. Instead, teachers will have the flexibility to upload and manage their own educational 
materials, ensuring that the content is relevant and aligned with the specific curriculum and needs of their students. This approach will 
empower educators to tailor the system to their local context and provide them with tools to curate and deliver their lessons effectively.

### Objectives
* **Accessibility**: Ensure that students and educators can access educational management software and resources even in areas with limited or 
no internet connectivity.
* **Customization**: Provide tools that allow teachers to upload and manage their own content, ensuring that the material is relevant and 
tailored to the students’ needs.
* **Scalability**: Create a system that can be easily adopted and expanded to other regions within Africa and possibly other LAN-based systems 
like Rachel Plus.
* **Tracking and Assessment**: Implement features that allow for comprehensive monitoring of student performance and progress over time.

### Key Features
* **Offline Capabilities**: Enable the system to function fully offline, allowing teachers and students to access and interact with content 
without needing the internet. Content and progress is synced between the different devices on a local network.
* **Custom content upload**: Teachers will have full control over the content in the system, uploading their own materials, quizzes, 
assignments, and resources. This ensures that all content is relevant and aligned with local educational standards.
* **Student progress tracking**: Provide detailed analytics on student performance, enabling teachers to monitor progress, identify learning 
trends, and make data-driven decisions to support student growth.
* **Quiz and Assessment tools**: Easy-to-use tools for creating and administering quizzes, tests, and assignments, with automatic grading and 
feedback to streamline the assessment process.
* **Trend analysis**
* **Possible integration with existing devices**: Work towards integrating the LLMS with devices provided by World Possible and Enlight 
Africa, expanding the reach and impact of the system.

### Implementation Plan
1. **Phase 1: Assessing the needs of the target communities** -> E3 and Arusha primary and secondary schools. This could involve interviewing 
teachers on their presumed efficacy of the system for their schools.
2. **Phase 2: Design and development** -> based on the feedback received in phase 1, we design and develop features that are most beneficial 
for these schools.
3. **Phase 3: Pilot testing at E3Empower and possibly other schools**: Implement the system at E3Empower and a few other schools to gather 
feedback and make necessary adjustments.
4. **Phase 4: Deployment**
5. **Phase 5: Continuous Improvement**

### Expected Outcomes
* Enhanced educational management software and resource access: students in remote and underserved areas will have improved access to quality 
education.
* Improved student performance: With robust tracking, students will benefit from more targeted and effective instruction.
* Empowered educators: Teachers will have the tools they need to create, manage, and deliver educational content in a way that best supports 
their students’ learning.

### Possible Hindrances
* **Lack of access to devices**: A significant challenge could be the limited availability of devices for students and teachers, which may 
hinder the effective implementation of the LLMS. To mitigate this, the initial focus will be on schools with existing computer labs.
* **Resistance to change by local institutions**.

### Technical Details
#### Architecture
Microkernel architecture with a SQLite database.

#### Database
SQLite: The LLMS will use SQLite as its database. SQLite is a lightweight, file-based database system that is easy to set up and maintain, 
making it ideal for local deployments, especially in environments with limited resources.

#### Network Infrastructure
Local Area Network (LAN): The system will be designed to operate over a Local Area Network, ensuring full functionality in environments with 
limited or no internet connectivity. This setup is particularly advantageous for schools with existing computer labs, allowing them to deploy 
the LLMS effectively and reliably. -> Can use a flash drive delivery method.


## Oasis LMS via WhatsApp
Oasis LMS in `services/oasis_lms` is a small FastAPI service that provides a WhatsApp-based learning interface. It uses a collection of "smol" agents for tasks like progress tracking, quiz generation, and teacher broadcasts. Teachers can now send quiz questions directly from WhatsApp and review student results. See `services/oasis_lms/README.md` for setup details.
