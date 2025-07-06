interface Props {
	isMobile: boolean;
	isSidebarCollapsed: boolean;
	isMobileMenuOpen: boolean;
	toggleSidebar: () => void;
	toggleMobileMenu: () => void;
}

export default function SidebarToggleButton({
	isMobile,
	isSidebarCollapsed,
	isMobileMenuOpen,
	toggleSidebar,
	toggleMobileMenu,
}: Props) {
	return isMobile ? (
		<button
			onClick={toggleMobileMenu}
			className="fixed top-4 left-4 z-[1001] w-12 h-12 text-2xl bg-gray-700 text-white rounded-xl"
			aria-label={isMobileMenuOpen ? "Fermer menu" : "Ouvrir menu"}
		>
			{isMobileMenuOpen ? "×" : "☰"}
		</button>
	) : (
		<button
			onClick={toggleSidebar}
			title="Ctrl+B pour basculer la sidebar"
			className={`fixed top-4 z-[1001] w-10 h-10 text-xl bg-gray-700 text-white rounded-lg transition-left duration-300 ${
				isSidebarCollapsed ? "left-4" : "left-[260px]"
			}`}
			aria-pressed={!isSidebarCollapsed}
			aria-label={
				isSidebarCollapsed ? "Afficher sidebar" : "Masquer sidebar"
			}
		>
			{isSidebarCollapsed ? "→" : "←"}
		</button>
	);
}
