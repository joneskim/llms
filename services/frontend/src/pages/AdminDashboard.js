// src/AdminDashboard.js
import React from 'react';
import { Box, Flex, IconButton, Avatar, useColorMode, Drawer, DrawerContent, Text, useDisclosure } from '@chakra-ui/react';
import { FiMenu, FiHome, FiBook, FiFileText, FiUsers, FiLogOut } from 'react-icons/fi';
import { Outlet, Link } from 'react-router-dom';

const SidebarContent = ({ onClose, ...rest }) => (
    <Box
        bg="gray.900"
        borderRight="1px"
        borderRightColor="gray.700"
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
    >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">
                Admin Panel
            </Text>
        </Flex>
        <Box mt={4}>
            <NavItem icon={FiHome} to="/admin">
                Dashboard
            </NavItem>
            <NavItem icon={FiBook} to="/admin/courses">
                Courses
            </NavItem>
            <NavItem icon={FiFileText} to="/admin/assignments">
                Assignments
            </NavItem>
            <NavItem icon={FiUsers} to="/admin/users">
                Users
            </NavItem>
        </Box>
    </Box>
);

const NavItem = ({ icon, children, to, ...rest }) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
                bg: 'gray.700',
                color: 'white',
            }}
            {...rest}
        >
            <IconButton
                mr="4"
                fontSize="16"
                variant="ghost"
                _hover={{ bg: 'transparent' }}
                icon={icon}
            />
            <Text>{children}</Text>
        </Flex>
    </Link>
);

const MobileNav = ({ onOpen, ...rest }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg="gray.900"
            borderBottomWidth="1px"
            borderBottomColor="gray.700"
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}
        >
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">
                Admin Panel
            </Text>

            <Flex alignItems="center">
                <Avatar size="sm" src="https://bit.ly/broken-link" />
                <IconButton
                    ml={4}
                    size="md"
                    fontSize="lg"
                    variant="ghost"
                    color="current"
                    icon={colorMode === 'light' ? 'moon' : 'sun'}
                    onClick={toggleColorMode}
                    aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                />
                <IconButton
                    ml={4}
                    size="md"
                    fontSize="lg"
                    variant="ghost"
                    color="red.500"
                    icon={<FiLogOut />}
                    aria-label="Log out"
                />
            </Flex>
        </Flex>
    );
};

const AdminDashboard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex minH="100vh">
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p={6} bg="gray.100" w="full">
                <Outlet />
            </Box>
        </Flex>
    );
};

export default AdminDashboard;
